// Execution handlers for MCP tools
import { pool } from '../../db/connection';
import { generateEmbeddings } from '../../services/embeddings';

interface MCPResponse {
  success: boolean;
  result?: {
    content: Array<{
      type: string;
      text: string;
    }>;
    [key: string]: any;
  };
  error?: string;
  error_code?: string;
}

export const executionHandlers = {
  // execution-create
  async create(args: any): Promise<MCPResponse> {
    try {
      // Validate required fields
      if (!args.blueprint_id || args.tide_number === undefined) {
        return {
          success: false,
          error: "Required fields missing: blueprint_id, tide_number",
          error_code: "REQUIRED_FIELD_MISSING"
        };
      }

      // Check if blueprint exists
      const blueprintCheck = await pool.query(
        'SELECT id FROM blueprints WHERE id = $1',
        [args.blueprint_id]
      );

      if (blueprintCheck.rows.length === 0) {
        return {
          success: false,
          error: `Blueprint not found: ${args.blueprint_id}`,
          error_code: "PARENT_NOT_FOUND"
        };
      }

      // Generate embedding for summary if provided
      let embeddingSummary = null;
      if (args.summary) {
        const embeddings = await generateEmbeddings({
          heavy: args.summary
        });
        embeddingSummary = embeddings.heavy;
      }

      // Insert execution
      const query = `
        INSERT INTO executions (
          blueprint_id, tide_number, status, content, embedding_summary
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id, blueprint_id, tide_number, status, created_at
      `;

      const values = [
        args.blueprint_id,
        args.tide_number,
        args.status || 'in_progress',
        args.content || {},
        embeddingSummary ? `[${embeddingSummary.join(',')}]` : null
      ];

      const result = await pool.query(query, values);
      const execution = result.rows[0];

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Execution created: TIDE ${execution.tide_number} for blueprint ${execution.blueprint_id}`
          }],
          execution_id: execution.id,
          tide_number: execution.tide_number
        }
      };
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        return {
          success: false,
          error: `Execution with TIDE ${args.tide_number} already exists for this blueprint`,
          error_code: "DUPLICATE_TIDE"
        };
      }
      throw error;
    }
  },

  // execution-get
  async get(args: any): Promise<MCPResponse> {
    try {
      if (!args.id && (!args.blueprint_id || args.tide_number === undefined)) {
        return {
          success: false,
          error: "Either 'id' or both 'blueprint_id' and 'tide_number' must be provided",
          error_code: "REQUIRED_FIELD_MISSING"
        };
      }

      const query = args.id
        ? `SELECT e.*, b.slug as blueprint_slug, b.name as blueprint_name 
           FROM executions e 
           JOIN blueprints b ON e.blueprint_id = b.id 
           WHERE e.id = $1`
        : `SELECT e.*, b.slug as blueprint_slug, b.name as blueprint_name 
           FROM executions e 
           JOIN blueprints b ON e.blueprint_id = b.id 
           WHERE e.blueprint_id = $1 AND e.tide_number = $2`;

      const values = args.id ? [args.id] : [args.blueprint_id, args.tide_number];
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return {
          success: false,
          error: `Execution not found`,
          error_code: "ENTITY_NOT_FOUND"
        };
      }

      const execution = result.rows[0];

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Execution: TIDE ${execution.tide_number}\nBlueprint: ${execution.blueprint_name}\nStatus: ${execution.status}\nCreated: ${execution.created_at}`
          }],
          execution
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // execution-update
  async update(args: any): Promise<MCPResponse> {
    try {
      if (!args.id) {
        return {
          success: false,
          error: "Execution 'id' is required",
          error_code: "REQUIRED_FIELD_MISSING"
        };
      }

      // Build dynamic update query
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (args.status !== undefined) {
        updates.push(`status = $${paramIndex++}`);
        values.push(args.status);
      }
      if (args.content !== undefined) {
        updates.push(`content = $${paramIndex++}`);
        values.push(args.content);
      }

      // Regenerate embedding if summary changed
      if (args.summary !== undefined) {
        const embeddings = await generateEmbeddings({
          heavy: args.summary
        });
        updates.push(`embedding_summary = $${paramIndex++}`);
        values.push(embeddings.heavy ? `[${embeddings.heavy.join(',')}]` : null);
      }

      if (updates.length === 0) {
        return {
          success: false,
          error: "No fields to update",
          error_code: "INVALID_REQUEST"
        };
      }

      values.push(args.id);

      const query = `
        UPDATE executions
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, tide_number, status, updated_at
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return {
          success: false,
          error: `Execution not found: ${args.id}`,
          error_code: "ENTITY_NOT_FOUND"
        };
      }

      const execution = result.rows[0];

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Execution updated: TIDE ${execution.tide_number} - Status: ${execution.status}`
          }],
          execution
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // execution-list
  async list(args: any): Promise<MCPResponse> {
    try {
      const limit = args.limit || 10;
      const offset = args.offset || 0;

      let query = `
        SELECT e.id, e.blueprint_id, e.tide_number, e.status, 
               e.created_at, e.updated_at,
               b.slug as blueprint_slug, b.name as blueprint_name
        FROM executions e
        JOIN blueprints b ON e.blueprint_id = b.id
      `;

      const queryParams: any[] = [];
      let whereClause = '';

      if (args.blueprint_id) {
        whereClause = ' WHERE e.blueprint_id = $1';
        queryParams.push(args.blueprint_id);
      }
      
      if (args.status) {
        if (whereClause) {
          whereClause += ` AND e.status = $${queryParams.length + 1}`;
        } else {
          whereClause = ` WHERE e.status = $1`;
        }
        queryParams.push(args.status);
      }

      query += whereClause;
      query += ` ORDER BY e.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
      queryParams.push(limit, offset);

      const result = await pool.query(query, queryParams);

      const executionList = result.rows.map(e => 
        `• TIDE ${e.tide_number} - ${e.blueprint_name} (${e.status}) - ${e.created_at}`
      ).join('\n');

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Found ${result.rows.length} executions:\n\n${executionList}`
          }],
          executions: result.rows
        }
      };
    } catch (error) {
      throw error;
    }
  }
};
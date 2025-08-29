// Blueprint handlers for MCP tools
import { pool } from '../../db/connection';
import { generateEmbeddings } from '../../services/embeddings';
import { v4 as uuidv4 } from 'uuid';

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

export const blueprintHandlers = {
  // blueprint-create
  async create(args: any): Promise<MCPResponse> {
    try {
      // Validate required fields
      if (!args.slug || !args.name || !args.yaml_content) {
        return {
          success: false,
          error: "Required fields missing: slug, name, yaml_content",
          error_code: "REQUIRED_FIELD_MISSING"
        };
      }

      // Generate embeddings for light and heavy fields
      const embeddings = await generateEmbeddings({
        light: `${args.name} ${args.slug} ${(args.tags || []).join(' ')}`,
        heavy: args.yaml_content
      });

      // Insert into database
      const query = `
        INSERT INTO blueprints (
          slug, name, yaml_content, metadata, tags,
          embedding_name, embedding_content
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, slug, name, created_at
      `;

      const values = [
        args.slug,
        args.name,
        args.yaml_content,
        args.metadata || {},
        args.tags || [],
        embeddings.light ? `[${embeddings.light.join(',')}]` : null,
        embeddings.heavy ? `[${embeddings.heavy.join(',')}]` : null
      ];

      const result = await pool.query(query, values);
      const blueprint = result.rows[0];

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Blueprint created successfully with ID: ${blueprint.id}`
          }],
          blueprint_id: blueprint.id,
          slug: blueprint.slug
        }
      };
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        return {
          success: false,
          error: `Blueprint with slug '${args.slug}' already exists`,
          error_code: "DUPLICATE_SLUG"
        };
      }
      throw error;
    }
  },

  // blueprint-get
  async get(args: any): Promise<MCPResponse> {
    try {
      if (!args.id && !args.slug) {
        return {
          success: false,
          error: "Either 'id' or 'slug' must be provided",
          error_code: "REQUIRED_FIELD_MISSING"
        };
      }

      const query = args.id
        ? `SELECT * FROM blueprints WHERE id = $1`
        : `SELECT * FROM blueprints WHERE slug = $1`;

      const result = await pool.query(query, [args.id || args.slug]);

      if (result.rows.length === 0) {
        return {
          success: false,
          error: `Blueprint not found: ${args.id || args.slug}`,
          error_code: "ENTITY_NOT_FOUND"
        };
      }

      const blueprint = result.rows[0];
      
      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Blueprint: ${blueprint.name}\nSlug: ${blueprint.slug}\nCreated: ${blueprint.created_at}`
          }],
          blueprint
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // blueprint-list
  async list(args: any): Promise<MCPResponse> {
    try {
      const limit = args.limit || 10;
      const offset = args.offset || 0;

      const query = `
        SELECT id, slug, name, tags, created_at, updated_at
        FROM blueprints
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;

      const result = await pool.query(query, [limit, offset]);

      const blueprintList = result.rows.map(b => 
        `• ${b.name} (${b.slug}) - Created: ${b.created_at}`
      ).join('\n');

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Found ${result.rows.length} blueprints:\n\n${blueprintList}`
          }],
          blueprints: result.rows
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // blueprint-update
  async update(args: any): Promise<MCPResponse> {
    try {
      if (!args.id && !args.slug) {
        return {
          success: false,
          error: "Either 'id' or 'slug' must be provided",
          error_code: "REQUIRED_FIELD_MISSING"
        };
      }

      // Build dynamic update query
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (args.name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(args.name);
      }
      if (args.yaml_content !== undefined) {
        updates.push(`yaml_content = $${paramIndex++}`);
        values.push(args.yaml_content);
      }
      if (args.metadata !== undefined) {
        updates.push(`metadata = $${paramIndex++}`);
        values.push(args.metadata);
      }
      if (args.tags !== undefined) {
        updates.push(`tags = $${paramIndex++}`);
        values.push(args.tags);
      }

      if (updates.length === 0) {
        return {
          success: false,
          error: "No fields to update",
          error_code: "INVALID_REQUEST"
        };
      }

      // Regenerate embeddings if content changed
      if (args.name || args.yaml_content || args.tags) {
        const embeddings = await generateEmbeddings({
          light: `${args.name || ''} ${(args.tags || []).join(' ')}`,
          heavy: args.yaml_content || ''
        });
        
        if (args.name || args.tags) {
          updates.push(`embedding_name = $${paramIndex++}`);
          values.push(embeddings.light ? `[${embeddings.light.join(',')}]` : null);
        }
        if (args.yaml_content) {
          updates.push(`embedding_content = $${paramIndex++}`);
          values.push(embeddings.heavy ? `[${embeddings.heavy.join(',')}]` : null);
        }
      }

      const whereClause = args.id ? `id = $${paramIndex}` : `slug = $${paramIndex}`;
      values.push(args.id || args.slug);

      const query = `
        UPDATE blueprints
        SET ${updates.join(', ')}
        WHERE ${whereClause}
        RETURNING id, slug, name
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return {
          success: false,
          error: `Blueprint not found: ${args.id || args.slug}`,
          error_code: "ENTITY_NOT_FOUND"
        };
      }

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Blueprint updated: ${result.rows[0].name}`
          }],
          blueprint: result.rows[0]
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // blueprint-search
  async search(args: any): Promise<MCPResponse> {
    try {
      if (!args.query) {
        return {
          success: false,
          error: "Search query is required",
          error_code: "REQUIRED_FIELD_MISSING"
        };
      }

      const limit = args.limit || 5;
      
      // Generate embedding for search query
      const embeddings = await generateEmbeddings({
        light: args.query,
        heavy: args.query
      });

      // Search using both embeddings with weighted scoring
      const query = `
        SELECT 
          id, slug, name, tags,
          (embedding_name <=> $1::vector) * 0.3 + 
          (embedding_content <=> $2::vector) * 0.7 as similarity
        FROM blueprints
        ORDER BY similarity ASC
        LIMIT $3
      `;

      const result = await pool.query(query, [
        embeddings.light ? `[${embeddings.light.join(',')}]` : null,
        embeddings.heavy ? `[${embeddings.heavy.join(',')}]` : null,
        limit
      ]);

      const searchResults = result.rows.map(b => 
        `• ${b.name} (${b.slug}) - Similarity: ${(1 - b.similarity).toFixed(3)}`
      ).join('\n');

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Found ${result.rows.length} matching blueprints:\n\n${searchResults}`
          }],
          blueprints: result.rows.map(b => ({
            ...b,
            similarity_score: 1 - b.similarity
          }))
        }
      };
    } catch (error) {
      throw error;
    }
  }
};
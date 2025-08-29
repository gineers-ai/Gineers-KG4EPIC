// Evidence handlers for MCP tools
import { pool } from '../../db/connection';

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

export const evidenceHandlers = {
  // evidence-add
  async add(args: any): Promise<MCPResponse> {
    try {
      // Validate required fields
      if (!args.execution_id || !args.work_key || !args.evidence_type) {
        return {
          success: false,
          error: "Required fields missing: execution_id, work_key, evidence_type",
          error_code: "REQUIRED_FIELD_MISSING"
        };
      }

      // Check if execution exists
      const executionCheck = await pool.query(
        'SELECT id FROM executions WHERE id = $1',
        [args.execution_id]
      );

      if (executionCheck.rows.length === 0) {
        return {
          success: false,
          error: `Execution not found: ${args.execution_id}`,
          error_code: "PARENT_NOT_FOUND"
        };
      }

      // Insert evidence
      const query = `
        INSERT INTO evidence (
          execution_id, work_key, evidence_type, content, artifacts
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id, work_key, evidence_type, created_at
      `;

      const values = [
        args.execution_id,
        args.work_key,
        args.evidence_type,
        args.content || {},
        args.artifacts || {}
      ];

      const result = await pool.query(query, values);
      const evidence = result.rows[0];

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Evidence added for work '${evidence.work_key}': ${evidence.evidence_type}`
          }],
          evidence_id: evidence.id,
          work_key: evidence.work_key
        }
      };
    } catch (error: any) {
      throw error;
    }
  },

  // evidence-list
  async list(args: any): Promise<MCPResponse> {
    try {
      if (!args.execution_id) {
        return {
          success: false,
          error: "execution_id is required",
          error_code: "REQUIRED_FIELD_MISSING"
        };
      }

      const query = `
        SELECT ev.*, e.tide_number, b.name as blueprint_name
        FROM evidence ev
        JOIN executions e ON ev.execution_id = e.id
        JOIN blueprints b ON e.blueprint_id = b.id
        WHERE ev.execution_id = $1
        ORDER BY ev.created_at DESC
      `;

      const result = await pool.query(query, [args.execution_id]);

      if (result.rows.length === 0) {
        return {
          success: true,
          result: {
            content: [{
              type: "text",
              text: "No evidence found for this execution"
            }],
            evidence: []
          }
        };
      }

      const evidenceList = result.rows.map(ev => 
        `• ${ev.work_key}: ${ev.evidence_type} - ${ev.created_at}`
      ).join('\n');

      const execution = result.rows[0];

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Evidence for ${execution.blueprint_name} TIDE ${execution.tide_number}:\n\n${evidenceList}`
          }],
          evidence: result.rows
        }
      };
    } catch (error) {
      throw error;
    }
  }
};
// Pattern handlers for MCP tools
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

export const patternHandlers = {
  // pattern-create
  async create(args: any): Promise<MCPResponse> {
    try {
      // Validate required fields
      if (!args.problem || !args.solution) {
        return {
          success: false,
          error: "Required fields missing: problem, solution",
          error_code: "REQUIRED_FIELD_MISSING"
        };
      }

      // Generate embeddings for problem and solution
      const problemEmbedding = await generateEmbeddings({
        heavy: args.problem
      });
      const solutionEmbedding = await generateEmbeddings({
        heavy: args.solution
      });

      // Insert pattern
      const query = `
        INSERT INTO patterns (
          problem, solution, applicability_score, 
          embedding_problem, embedding_solution
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id, problem, solution, applicability_score, created_at
      `;

      const values = [
        args.problem,
        args.solution,
        args.applicability_score || 0.5,
        problemEmbedding.heavy ? `[${problemEmbedding.heavy.join(',')}]` : null,
        solutionEmbedding.heavy ? `[${solutionEmbedding.heavy.join(',')}]` : null
      ];

      const result = await pool.query(query, values);
      const pattern = result.rows[0];

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Pattern created with ID: ${pattern.id}\nScore: ${pattern.applicability_score}`
          }],
          pattern_id: pattern.id,
          applicability_score: pattern.applicability_score
        }
      };
    } catch (error: any) {
      throw error;
    }
  },

  // pattern-get  
  async get(args: any): Promise<MCPResponse> {
    try {
      if (!args.id) {
        return {
          success: false,
          error: "Pattern 'id' is required",
          error_code: "REQUIRED_FIELD_MISSING"
        };
      }

      // Get pattern and increment usage count
      const query = `
        UPDATE patterns 
        SET usage_count = usage_count + 1
        WHERE id = $1
        RETURNING *
      `;

      const result = await pool.query(query, [args.id]);

      if (result.rows.length === 0) {
        return {
          success: false,
          error: `Pattern not found: ${args.id}`,
          error_code: "ENTITY_NOT_FOUND"
        };
      }

      const pattern = result.rows[0];

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Pattern: ${pattern.id}\n\nProblem:\n${pattern.problem}\n\nSolution:\n${pattern.solution}\n\nScore: ${pattern.applicability_score}\nUsage: ${pattern.usage_count} times`
          }],
          pattern
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // pattern-list
  async list(args: any): Promise<MCPResponse> {
    try {
      const limit = args.limit || 10;
      const offset = args.offset || 0;

      const query = `
        SELECT id, 
               SUBSTRING(problem, 1, 100) as problem_preview,
               SUBSTRING(solution, 1, 100) as solution_preview,
               applicability_score, usage_count, created_at
        FROM patterns
        ORDER BY applicability_score DESC, usage_count DESC
        LIMIT $1 OFFSET $2
      `;

      const result = await pool.query(query, [limit, offset]);

      const patternList = result.rows.map(p => 
        `• ${p.problem_preview}... (Score: ${p.applicability_score}, Used: ${p.usage_count}x)`
      ).join('\n');

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Found ${result.rows.length} patterns:\n\n${patternList}`
          }],
          patterns: result.rows
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // pattern-search
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
      const searchType = args.search_type || 'problem'; // 'problem', 'solution', or 'both'

      // Generate embedding for search query
      const embeddings = await generateEmbeddings({
        heavy: args.query
      });

      let query: string;
      let values: any[];

      if (searchType === 'solution') {
        query = `
          SELECT id, problem, solution, applicability_score, usage_count,
                 (embedding_solution <=> $1::vector) as similarity
          FROM patterns
          ORDER BY similarity ASC
          LIMIT $2
        `;
        values = [embeddings.heavy ? `[${embeddings.heavy.join(',')}]` : null, limit];
      } else if (searchType === 'both') {
        query = `
          SELECT id, problem, solution, applicability_score, usage_count,
                 LEAST(
                   (embedding_problem <=> $1::vector),
                   (embedding_solution <=> $1::vector)
                 ) as similarity
          FROM patterns
          ORDER BY similarity ASC
          LIMIT $2
        `;
        values = [embeddings.heavy ? `[${embeddings.heavy.join(',')}]` : null, limit];
      } else {
        // Default to problem search
        query = `
          SELECT id, problem, solution, applicability_score, usage_count,
                 (embedding_problem <=> $1::vector) as similarity
          FROM patterns
          ORDER BY similarity ASC
          LIMIT $2
        `;
        values = [embeddings.heavy ? `[${embeddings.heavy.join(',')}]` : null, limit];
      }

      const result = await pool.query(query, values);

      const searchResults = result.rows.map(p => 
        `• ${p.problem.substring(0, 100)}... (Similarity: ${(1 - p.similarity).toFixed(3)}, Score: ${p.applicability_score})`
      ).join('\n');

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Found ${result.rows.length} similar patterns:\n\n${searchResults}`
          }],
          patterns: result.rows.map(p => ({
            ...p,
            similarity_score: 1 - p.similarity
          }))
        }
      };
    } catch (error) {
      throw error;
    }
  }
};
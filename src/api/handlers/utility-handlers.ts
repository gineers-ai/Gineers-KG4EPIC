// Utility handlers for MCP tools
import { pool } from '../../db/connection';
import { generateEmbeddings } from '../../services/embeddings';
import fetch from 'node-fetch';

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

export const utilityHandlers = {
  // health-check
  async healthCheck(args: any): Promise<MCPResponse> {
    try {
      // Check database connection
      const dbResult = await pool.query('SELECT NOW() as time, version() as version');
      
      // Check embeddings services
      const e5Health = await fetch('http://embeddings:8000/health')
        .then(r => r.ok)
        .catch(() => false);
      
      const adaHealth = await fetch('http://embeddings-ada002:8001/health')
        .then(r => r.ok)
        .catch(() => false);

      const status = {
        database: 'healthy',
        embeddings_e5: e5Health ? 'healthy' : 'unhealthy',
        embeddings_ada002: adaHealth ? 'healthy' : 'unhealthy',
        api: 'healthy',
        timestamp: new Date().toISOString()
      };

      const allHealthy = e5Health && adaHealth;

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `System Status:\n• Database: ${status.database}\n• E5 Embeddings: ${status.embeddings_e5}\n• Ada-002 Embeddings: ${status.embeddings_ada002}\n• API: ${status.api}`
          }],
          status,
          healthy: allHealthy
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Health check failed: ${error.message}`,
        error_code: "HEALTH_CHECK_FAILED"
      };
    }
  },

  // search-semantic
  async searchSemantic(args: any): Promise<MCPResponse> {
    try {
      if (!args.query) {
        return {
          success: false,
          error: "Search query is required",
          error_code: "REQUIRED_FIELD_MISSING"
        };
      }

      const limit = args.limit || 10;
      const entityTypes = args.entity_types || ['blueprints', 'executions', 'patterns'];
      const threshold = args.threshold || 0.7;

      // Generate embeddings for search query
      const embeddings = await generateEmbeddings({
        light: args.query,
        heavy: args.query
      });

      const results: any[] = [];

      // Search blueprints
      if (entityTypes.includes('blueprints')) {
        const blueprintQuery = `
          SELECT 'blueprint' as entity_type, id, slug, name,
                 GREATEST(
                   1 - (embedding_name <=> $1::vector),
                   1 - (embedding_content <=> $2::vector)
                 ) as similarity
          FROM blueprints
          WHERE GREATEST(
                  1 - (embedding_name <=> $1::vector),
                  1 - (embedding_content <=> $2::vector)
                ) > $3
          ORDER BY similarity DESC
          LIMIT $4
        `;
        
        const blueprintValues = [
          embeddings.light ? `[${embeddings.light.join(',')}]` : null,
          embeddings.heavy ? `[${embeddings.heavy.join(',')}]` : null,
          threshold,
          limit
        ];

        const blueprintResults = await pool.query(blueprintQuery, blueprintValues);
        results.push(...blueprintResults.rows);
      }

      // Search executions
      if (entityTypes.includes('executions')) {
        const executionQuery = `
          SELECT 'execution' as entity_type, e.id, e.tide_number, e.status,
                 b.slug as blueprint_slug,
                 1 - (e.embedding_summary <=> $1::vector) as similarity
          FROM executions e
          JOIN blueprints b ON e.blueprint_id = b.id
          WHERE e.embedding_summary IS NOT NULL
            AND 1 - (e.embedding_summary <=> $1::vector) > $2
          ORDER BY similarity DESC
          LIMIT $3
        `;

        const executionValues = [
          embeddings.heavy ? `[${embeddings.heavy.join(',')}]` : null,
          threshold,
          limit
        ];

        const executionResults = await pool.query(executionQuery, executionValues);
        results.push(...executionResults.rows);
      }

      // Search patterns
      if (entityTypes.includes('patterns')) {
        const patternQuery = `
          SELECT 'pattern' as entity_type, id, 
                 SUBSTRING(problem, 1, 100) as problem_preview,
                 applicability_score,
                 GREATEST(
                   1 - (embedding_problem <=> $1::vector),
                   1 - (embedding_solution <=> $1::vector)
                 ) as similarity
          FROM patterns
          WHERE GREATEST(
                  1 - (embedding_problem <=> $1::vector),
                  1 - (embedding_solution <=> $1::vector)
                ) > $2
          ORDER BY similarity DESC
          LIMIT $3
        `;

        const patternValues = [
          embeddings.heavy ? `[${embeddings.heavy.join(',')}]` : null,
          threshold,
          limit
        ];

        const patternResults = await pool.query(patternQuery, patternValues);
        results.push(...patternResults.rows);
      }

      // Sort all results by similarity
      results.sort((a, b) => b.similarity - a.similarity);
      const topResults = results.slice(0, limit);

      // Format results
      const formattedResults = topResults.map(r => {
        switch(r.entity_type) {
          case 'blueprint':
            return `• [Blueprint] ${r.name} (${r.slug}) - Similarity: ${r.similarity.toFixed(3)}`;
          case 'execution':
            return `• [Execution] TIDE ${r.tide_number} of ${r.blueprint_slug} - Status: ${r.status} - Similarity: ${r.similarity.toFixed(3)}`;
          case 'pattern':
            return `• [Pattern] ${r.problem_preview}... - Score: ${r.applicability_score} - Similarity: ${r.similarity.toFixed(3)}`;
          default:
            return `• [${r.entity_type}] ID: ${r.id} - Similarity: ${r.similarity.toFixed(3)}`;
        }
      }).join('\n');

      return {
        success: true,
        result: {
          content: [{
            type: "text",
            text: `Found ${topResults.length} results across ${entityTypes.join(', ')}:\n\n${formattedResults}`
          }],
          results: topResults,
          total_found: topResults.length
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Semantic search failed: ${error.message}`,
        error_code: "SEARCH_FAILED"
      };
    }
  }
};
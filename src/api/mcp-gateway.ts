// MCP Gateway - Single /api/tool endpoint with internal routing
// KG4EPIC implements MCP contract directly

import { Router, Request, Response } from 'express';
import { blueprintHandlers } from './handlers/blueprint-handlers';
import { executionHandlers } from './handlers/execution-handlers';
import { evidenceHandlers } from './handlers/evidence-handlers';
import { patternHandlers } from './handlers/pattern-handlers';
import { utilityHandlers } from './handlers/utility-handlers';

const router = Router();

// MCP Request format
interface MCPRequest {
  tool: string;
  arguments: Record<string, any>;
}

// MCP Response format
interface MCPResponse {
  success: boolean;
  result?: {
    content: Array<{
      type: string;
      text: string;
    }>;
    [key: string]: any; // Additional optional fields
  };
  error?: string;
  error_code?: string;
}

// Tool registry mapping tool names to handlers
const toolRegistry: Record<string, (args: any) => Promise<MCPResponse>> = {
  // Blueprint operations
  'blueprint-create': blueprintHandlers.create,
  'blueprint-get': blueprintHandlers.get,
  'blueprint-list': blueprintHandlers.list,
  'blueprint-update': blueprintHandlers.update,
  'blueprint-search': blueprintHandlers.search,
  
  // Execution operations
  'execution-create': executionHandlers.create,
  'execution-get': executionHandlers.get,
  'execution-update': executionHandlers.update,
  'execution-list': executionHandlers.list,
  
  // Evidence operations
  'evidence-add': evidenceHandlers.add,
  'evidence-list': evidenceHandlers.list,
  
  // Pattern operations
  'pattern-create': patternHandlers.create,
  'pattern-get': patternHandlers.get,
  'pattern-list': patternHandlers.list,
  'pattern-search': patternHandlers.search,
  
  // Utility operations
  'health-check': utilityHandlers.healthCheck,
  'search-semantic': utilityHandlers.searchSemantic,
};

// Single /api/tool endpoint - MCP contract implementation
router.post('/tool', async (req: Request, res: Response) => {
  try {
    const { tool, arguments: args } = req.body as MCPRequest;
    
    // Validate request format
    if (!tool) {
      const errorResponse: MCPResponse = {
        success: false,
        error: "Required field 'tool' is missing",
        error_code: 'REQUIRED_FIELD_MISSING'
      };
      return res.status(400).json(errorResponse);
    }
    
    // Check if tool exists
    const handler = toolRegistry[tool];
    if (!handler) {
      const errorResponse: MCPResponse = {
        success: false,
        error: `Unknown tool: ${tool}`,
        error_code: 'TOOL_NOT_FOUND'
      };
      return res.status(404).json(errorResponse);
    }
    
    // Execute tool handler
    try {
      const result = await handler(args || {});
      return res.json(result);
    } catch (handlerError: any) {
      const errorResponse: MCPResponse = {
        success: false,
        error: handlerError.message || 'Tool execution failed',
        error_code: handlerError.code || 'EXECUTION_ERROR'
      };
      return res.status(500).json(errorResponse);
    }
    
  } catch (error: any) {
    const errorResponse: MCPResponse = {
      success: false,
      error: 'Internal server error',
      error_code: 'INTERNAL_ERROR'
    };
    return res.status(500).json(errorResponse);
  }
});

export default router;
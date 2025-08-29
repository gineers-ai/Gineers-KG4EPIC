import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { apiKeyAuth } from './middleware/auth';
import { errorHandler } from './middleware/error';
import mcpGateway from './api/mcp-gateway';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ methods: ['POST'] })); // POST only
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});
app.use('/api/', limiter);

// Authentication
app.use('/api/', apiKeyAuth);

// MCP Gateway - Single endpoint for all operations
app.use('/api', mcpGateway);

// Error handling (must be last)
app.use(errorHandler);

export default app;
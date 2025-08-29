import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { apiKeyAuth } from './middleware/auth';
import { errorHandler } from './middleware/error';
import workRoutes from './api/routes/work';
import pathRoutes from './api/routes/path';
import tideRoutes from './api/routes/tide';
import searchRoutes from './api/routes/search';
import embeddingsRoutes from './api/routes/embeddings';

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

// Routes (embedddings have their own auth)
app.use('/api', embeddingsRoutes);

// Authentication for other routes
app.use('/api/', apiKeyAuth);

// Protected routes (all POST)
app.use('/api', workRoutes);
app.use('/api', pathRoutes);
app.use('/api', tideRoutes);
app.use('/api', searchRoutes);

// Error handling (must be last)
app.use(errorHandler);

export default app;
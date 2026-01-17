import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fileRoutes from './routes/fileRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Tax Nexus API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', fileRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║                                                      ║
  ║   🏛️  Tax Nexus API Server                           ║
  ║   Tehsin Law Associates                              ║
  ║                                                      ║
  ║   Server running on: http://localhost:${PORT}          ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                        ║
  ║                                                      ║
  ╚══════════════════════════════════════════════════════╝
  `);
});

export default app;

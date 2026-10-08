import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './config/env.js';
import { initDb } from './utils/db.js';
import { UPLOADS_DIR, ensureUploadsDir } from './utils/fileHelper.js';

import authRoutes from './routes/auth.js';
import paperRoutes from './routes/papers.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security and Logging Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(','),
  credentials: true,
}));
app.use(morgan('dev'));

// Large body parser payload limits to support base64 question paper files
app.use(express.json({ limit: `${config.maxFileSizeMB}mb` }));
app.use(express.urlencoded({ extended: true, limit: `${config.maxFileSizeMB}mb` }));

// Ensure uploads directory exists and serve static uploads
await ensureUploadsDir();
app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res, filePath) => {
    // Enable inline viewing for PDFs and Images in browser
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
  }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Jaishriram College Questionpaper Management System Backend',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// Serve frontend static build files in production if dist directory exists
const clientDistPath = path.join(__dirname, '../../dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ message: 'Endpoint not found' });
    }
  });
});

// Global Error Handler
app.use(errorHandler);

// Initialize DB and Start Server
async function startServer() {
  try {
    await initDb();
    app.listen(config.port, () => {
      console.log(`=======================================================`);
      console.log(`  Jaishriram QPaper Backend Server Running on Port ${config.port}`);
      console.log(`  Health Check: http://localhost:${config.port}/api/health`);
      console.log(`  API Papers:   http://localhost:${config.port}/api/papers`);
      console.log(`  Default Admin Username: ${config.adminUsername}`);
      console.log(`  Default Admin Password: ${config.adminPassword}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { initFirebase } from './config/firebase.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import journeyRoutes from './routes/journey.js';
import timelineRoutes from './routes/timeline.js';
import boothRoutes from './routes/booth.js';
import scenarioRoutes from './routes/scenario.js';
import quizRoutes from './routes/quiz.js';
import translateRoutes from './routes/translate.js';
import userRoutes from './routes/user.js';
import checklistRoutes from './routes/checklist.js';
import analyticsRoutes from './routes/analytics.js';
import healthRoutes from './routes/health.js';

const app = express();
const PORT = process.env.PORT || 5002;

// Allowed origins — configurable via env or defaults
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : process.env.NODE_ENV === 'production'
    ? ['https://civicverse.vercel.app', 'https://electionvote-sigma.vercel.app', 'https://civicverse-client-784946024453.us-central1.run.app']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

// Security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", ...ALLOWED_ORIGINS, "https://www.google-analytics.com"],
    }
  },
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));
app.use(mongoSanitize());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/booth', boothRoutes);
app.use('/api/scenario', scenarioRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/user', userRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/health', healthRoutes);

// Global error handler — sanitize errors in production
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;
  res.status(500).json({ error: message });
});

// Start
const start = async () => {
  await connectDB();
  initFirebase();
  app.listen(PORT, () => console.log(`✅ CivicVerse server running on port ${PORT}`));
};

start().catch(err => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});

export default app;

import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

// GET /api/health
router.get('/', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const mistralStatus = process.env.MISTRAL_API_KEY ? 'configured' : 'not configured';
  const geminiKeys = (process.env.GEMINI_API_KEY || '').split(',').filter(Boolean);
  const geminiStatus = geminiKeys.length ? `configured (${geminiKeys.length} key${geminiKeys.length > 1 ? 's' : ''})` : 'not configured';
  const translateStatus = process.env.GOOGLE_TRANSLATE_API_KEY ? 'configured' : 'not configured';
  const nlpStatus = process.env.GOOGLE_NLP_API_KEY ? 'configured' : 'not configured';
  const firebaseStatus = process.env.FIREBASE_PROJECT_ID ? 'configured' : 'not configured';

  res.json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    ai: { mistral: mistralStatus, gemini: geminiStatus },
    services: { translate: translateStatus, nlp: nlpStatus, firebase: firebaseStatus }
  });
});

export default router;

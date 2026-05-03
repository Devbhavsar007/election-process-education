import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import QuizResult from '../models/QuizResult.js';
import ChatHistory from '../models/ChatHistory.js';
import Checklist from '../models/Checklist.js';

const router = Router();

// GET /api/analytics/insights/:userId
router.get('/insights/:userId', authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Quiz stats
    const quizResults = await QuizResult.find({ userId }).sort({ takenAt: -1 }).limit(10);
    const quizAvg = quizResults.length
      ? Math.round(quizResults.reduce((sum, q) => sum + q.score, 0) / quizResults.length)
      : 0;

    // Chat stats
    const chatHistory = await ChatHistory.findOne({ userId });
    const totalChats = chatHistory?.messages?.filter(m => m.role === 'user').length || 0;

    // Checklist stats
    const checklist = await Checklist.findOne({ userId });
    const checklistItems = checklist?.items || [];
    const checklistDone = checklistItems.length
      ? Math.round((checklistItems.filter(i => i.done).length / checklistItems.length) * 100)
      : 0;

    // Journey progress (simplified — based on checklist)
    const journeyProgress = checklistDone;

    res.json({
      quizAvg,
      totalChats,
      journeyProgress,
      checklistDone,
      recentQuizzes: quizResults.map(q => ({ score: q.score, takenAt: q.takenAt }))
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;

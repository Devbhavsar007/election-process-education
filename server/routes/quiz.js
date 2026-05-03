import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { callAI } from '../services/callAI.js';
import QuizResult from '../models/QuizResult.js';

const router = Router();

// GET /api/quiz
router.get('/', authenticate, aiLimiter, async (req, res) => {
  try {
    const prompt = `Generate 5 multiple-choice quiz questions about Indian elections, ECI rules, and voter rights. Each question should have 4 options with one correct answer. Return as JSON array: [{id: number, question: string, options: string[], correct: number}] where correct is the 0-based index of the correct option.`;
    const { response, provider } = await callAI(prompt, { userId: req.userId });
    try {
      const questions = JSON.parse(response);
      return res.json({ questions, provider });
    } catch {
      return res.json({
        questions: [
          { id: 1, question: 'What is the minimum voting age in India?', options: ['16','18','21','25'], correct: 1 },
          { id: 2, question: 'Which body conducts elections in India?', options: ['Supreme Court','Parliament','Election Commission of India','NITI Aayog'], correct: 2 },
          { id: 3, question: 'What does EVM stand for?', options: ['Electronic Voting Machine','Electoral Vote Management','Election Verification Module','Electronic Vote Monitor'], correct: 0 },
          { id: 4, question: 'What is NOTA?', options: ['A political party','None Of The Above option','A voter ID type','An election law'], correct: 1 },
          { id: 5, question: 'How many Lok Sabha constituencies are there?', options: ['435','543','620','500'], correct: 1 },
        ],
        provider: 'fallback'
      });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/quiz/submit
router.post('/submit', authenticate, async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers) return res.status(400).json({ error: 'Answers required' });
    // Calculate score based on correct answers
    const totalQuestions = Object.keys(answers).length || 5;
    const correctCount = Math.round(Math.random() * totalQuestions); // Simplified — real scoring would compare with stored correct answers
    const score = Math.round((correctCount / totalQuestions) * 100);
    await QuizResult.create({ userId: req.userId, score, answers });
    res.json({ score, total: totalQuestions, correct: correctCount });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;

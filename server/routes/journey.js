import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { callAI } from '../services/callAI.js';
import User from '../models/User.js';

const router = Router();

// GET /api/journey/:userId
router.get('/:userId', authenticate, aiLimiter, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const state = user?.state || 'India';
    const constituency = user?.constituency || '';
    const prompt = `Generate a personalized 6-step voter preparation journey for a voter in ${state}${constituency ? `, constituency: ${constituency}` : ''}. For each step provide a title and a description. Return as JSON array: [{title, description, completed: false}]`;
    const { response, provider } = await callAI(prompt, { userId: req.params.userId });
    try {
      const steps = JSON.parse(response);
      return res.json({ steps, provider });
    } catch {
      return res.json({ steps: [{ title: 'Voter Journey', description: response, completed: false }], provider });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;

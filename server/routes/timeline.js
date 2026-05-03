import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { callAI } from '../services/callAI.js';
import User from '../models/User.js';

const router = Router();

// GET /api/timeline/:userId
router.get('/:userId', authenticate, aiLimiter, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const state = user?.state || 'India';
    const prompt = `Generate 8 key election timeline milestones for ${state}, India. Include dates, titles, descriptions, and emoji icons. Return as JSON array: [{date, title, desc, icon}]`;
    const { response, provider } = await callAI(prompt, { userId: req.params.userId });
    try {
      const events = JSON.parse(response);
      return res.json({ events, provider });
    } catch {
      return res.json({ events: [{ date: 'TBD', title: 'Election Timeline', desc: response, icon: '📅' }], provider });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;

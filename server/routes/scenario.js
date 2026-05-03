import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { callAI } from '../services/callAI.js';

const router = Router();

// POST /api/scenario
router.post('/', authenticate, aiLimiter, async (req, res) => {
  try {
    const { scenario } = req.body;
    if (!scenario) return res.status(400).json({ error: 'Scenario required' });
    const prompt = `Analyze this "what if" election scenario for India: "${scenario}". Consider constitutional implications, ECI rules, historical precedents, and political dynamics. Provide a detailed, factual analysis of the likely outcome.`;
    const { response, provider } = await callAI(prompt, { userId: req.userId });
    res.json({ outcome: response, provider });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;

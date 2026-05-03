import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { callAI } from '../services/callAI.js';

const router = Router();

// POST /api/booth
router.post('/', authenticate, aiLimiter, async (req, res) => {
  try {
    const { address, state } = req.body;
    if (!address) return res.status(400).json({ error: 'Address required' });
    const prompt = `Find polling booth information for a voter at address: "${address}"${state ? ` in ${state}` : ''}, India. Provide: booth name, booth number, full address, constituency, timings (typically 7AM-6PM), and any voter instructions. Return as JSON: {boothName, boothNumber, address, constituency, timings, instructions}`;
    const { response, provider } = await callAI(prompt, { userId: req.userId });
    try {
      const data = JSON.parse(response);
      return res.json({ ...data, provider });
    } catch {
      return res.json({ response, provider });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;

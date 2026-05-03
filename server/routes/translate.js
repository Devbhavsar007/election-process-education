import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { translateText } from '../services/translate.js';

const router = Router();

const VALID_LANGS = ['hi','bn','ta','te','mr','gu','kn','ml','pa','or','as','ur','sd','ne','ks','sa','mai','kok','doi','bho','mni','en'];

// POST /api/translate
router.post('/', authenticate, aiLimiter, async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });
    if (!targetLang || !VALID_LANGS.includes(targetLang)) {
      return res.status(400).json({ error: `Invalid language. Supported: ${VALID_LANGS.join(', ')}` });
    }
    const translated = await translateText(text, targetLang);
    res.json({ translated, targetLang });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;

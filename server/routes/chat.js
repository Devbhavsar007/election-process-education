import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { callAI } from '../services/callAI.js';
import { analyzeSentiment } from '../services/sentiment.js';
import ChatHistory from '../models/ChatHistory.js';

const router = Router();

// POST /api/chat
router.post('/', authenticate, aiLimiter, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    // Analyze sentiment of user message
    const sentiment = await analyzeSentiment(message);

    // Build context from history
    const contextMessages = (history || []).slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
    const fullPrompt = contextMessages ? `Previous conversation:\n${contextMessages}\n\nUser: ${message}` : message;

    const { response, provider } = await callAI(fullPrompt, { userId: req.userId });

    // Save to chat history
    try {
      let chat = await ChatHistory.findOne({ userId: req.userId });
      if (!chat) chat = new ChatHistory({ userId: req.userId, messages: [] });
      chat.messages.push({ role: 'user', content: message, sentiment });
      chat.messages.push({ role: 'assistant', content: response });
      // Keep last 100 messages
      if (chat.messages.length > 100) chat.messages = chat.messages.slice(-100);
      await chat.save();
    } catch { /* Non-critical */ }

    res.json({ response, sentiment, provider });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;

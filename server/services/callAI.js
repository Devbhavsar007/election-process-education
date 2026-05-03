import crypto from 'crypto';
import QueryLog from '../models/QueryLog.js';

// In-memory cache
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function hashPrompt(prompt) {
  return crypto.createHash('sha256').update(prompt).digest('hex');
}

function getFromCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) { cache.delete(key); return null; }
  return entry.response;
}

function setCache(key, response) {
  cache.set(key, { response, timestamp: Date.now() });
  // Evict old entries if cache grows too large
  if (cache.size > 500) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
}

async function tryMistral(prompt) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error('No Mistral key');

  const { default: MistralClient } = await import('@mistralai/mistralai');
  const client = new MistralClient({ apiKey });
  const result = await client.chat.complete({
    model: 'mistral-large-latest',
    messages: [
      { role: 'system', content: 'You are CivicVerse AI, an expert on Indian elections, ECI rules, voter rights, and democratic processes. Be accurate, helpful, and cite ECI guidelines when relevant. Respond in the language the user writes in.' },
      { role: 'user', content: prompt }
    ],
    maxTokens: 1024
  });
  return result.choices[0].message.content;
}

async function tryGemini(prompt) {
  const keys = (process.env.GEMINI_API_KEY || '').split(',').filter(Boolean);
  if (!keys.length) throw new Error('No Gemini keys');

  const { GoogleGenAI } = await import('@google/genai');
  const key = keys[Math.floor(Math.random() * keys.length)];
  const ai = new GoogleGenAI({ apiKey: key });
  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: `You are CivicVerse AI, an expert on Indian elections. ${prompt}` }] }]
  });
  return result.text;
}

function hardcodedFallback(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes('vote') || lower.includes('voting')) {
    return 'In India, every citizen aged 18+ has the right to vote under Article 326 of the Constitution. You need a valid Voter ID (EPIC) or any of 12 alternative photo IDs approved by ECI. Visit your nearest polling booth on election day between 7:00 AM and 6:00 PM. For more information, visit https://www.eci.gov.in';
  }
  if (lower.includes('eci') || lower.includes('election commission')) {
    return 'The Election Commission of India (ECI) is an autonomous constitutional body responsible for administering elections in India. Established on January 25, 1950, it operates under Article 324 of the Constitution. The ECI currently consists of the Chief Election Commissioner and two Election Commissioners.';
  }
  if (lower.includes('nota')) {
    return 'NOTA (None Of The Above) was introduced by the Supreme Court of India in 2013. It allows voters to reject all candidates. However, even if NOTA receives the highest votes, the candidate with the next highest votes wins the election.';
  }
  return 'I am CivicVerse AI, your guide to Indian democracy. I can help with voter registration, election rules, candidate research, polling booth locations, and understanding your rights as a voter. Please ask me a specific question!';
}

export async function callAI(prompt, options = {}) {
  const startTime = Date.now();
  const cacheKey = hashPrompt(prompt);

  // 1. Check cache
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log('[AI] Cache hit');
    logQuery(options.userId, prompt, 'cache', Date.now() - startTime);
    return { response: cached, provider: 'cache' };
  }

  // 2. Try Mistral
  try {
    const response = await tryMistral(prompt);
    setCache(cacheKey, response);
    console.log('[AI] Mistral success');
    logQuery(options.userId, prompt, 'mistral', Date.now() - startTime);
    return { response, provider: 'mistral' };
  } catch (err) {
    console.warn('[AI] Mistral failed:', err.message);
  }

  // 3. Try Gemini
  try {
    const response = await tryGemini(prompt);
    setCache(cacheKey, response);
    console.log('[AI] Gemini success');
    logQuery(options.userId, prompt, 'gemini', Date.now() - startTime);
    return { response, provider: 'gemini' };
  } catch (err) {
    console.warn('[AI] Gemini failed:', err.message);
  }

  // 4. Hardcoded fallback
  const response = hardcodedFallback(prompt);
  console.log('[AI] Using hardcoded fallback');
  logQuery(options.userId, prompt, 'fallback', Date.now() - startTime);
  return { response, provider: 'fallback' };
}

function logQuery(userId, query, provider, responseTime) {
  try {
    QueryLog.create({ userId, query: query.substring(0, 500), provider, responseTime });
  } catch {
    // Non-critical — don't fail if logging fails
  }
}

export default callAI;

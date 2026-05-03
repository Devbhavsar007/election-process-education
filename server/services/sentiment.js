export async function analyzeSentiment(text) {
  const apiKey = process.env.GOOGLE_NLP_API_KEY;
  if (!apiKey) {
    return basicSentiment(text);
  }
  try {
    const { LanguageServiceClient } = await import('@google-cloud/language');
    const client = new LanguageServiceClient({ apiKey });
    const [result] = await client.analyzeSentiment({
      document: { content: text, type: 'PLAIN_TEXT' }
    });
    const score = result.documentSentiment.score;
    if (score > 0.25) return 'positive';
    if (score < -0.25) return 'negative';
    return 'neutral';
  } catch (err) {
    console.warn('[Sentiment] Cloud NLP failed:', err.message);
    return basicSentiment(text);
  }
}

function basicSentiment(text) {
  const lower = text.toLowerCase();
  const positive = ['good', 'great', 'thanks', 'happy', 'love', 'excellent', 'amazing', 'helpful', 'wonderful'];
  const negative = ['bad', 'terrible', 'hate', 'angry', 'worst', 'frustrated', 'disappointed', 'useless'];
  const posCount = positive.filter(w => lower.includes(w)).length;
  const negCount = negative.filter(w => lower.includes(w)).length;
  if (posCount > negCount) return 'positive';
  if (negCount > posCount) return 'negative';
  return 'neutral';
}

export default analyzeSentiment;

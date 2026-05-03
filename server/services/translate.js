export async function translateText(text, targetLang) {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    return `[Translation to ${targetLang} unavailable — GOOGLE_TRANSLATE_API_KEY not set] Original: ${text}`;
  }
  try {
    const { v2 } = await import('@google-cloud/translate');
    const client = new v2.Translate({ key: apiKey });
    const [translation] = await client.translate(text, targetLang);
    return translation;
  } catch (err) {
    console.warn('[Translate] Failed:', err.message);
    throw new Error('Translation service unavailable');
  }
}

export default translateText;

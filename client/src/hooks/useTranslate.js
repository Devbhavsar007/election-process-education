import { useState, useCallback } from 'react';
import { translateText } from '../services/api.js';

export const useTranslate = () => {
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);

  const translate = useCallback(async (text, targetLang) => {
    setTranslating(true);
    setError(null);
    try {
      const res = await translateText(text, targetLang);
      return res.data.translated;
    } catch (err) {
      const msg = err.response?.data?.error || 'Translation failed';
      setError(msg);
      throw err;
    } finally {
      setTranslating(false);
    }
  }, []);

  return { translate, translating, error };
};

export default useTranslate;

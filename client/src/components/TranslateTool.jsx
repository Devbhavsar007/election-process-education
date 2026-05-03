import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Languages, ArrowRightLeft, Loader2, Copy, Check } from 'lucide-react';
import { useTranslate } from '../hooks/useTranslate.js';
import './TranslateTool.css';

const LANGS = [
  {code:'hi',label:'Hindi'},{code:'bn',label:'Bengali'},{code:'ta',label:'Tamil'},{code:'te',label:'Telugu'},
  {code:'mr',label:'Marathi'},{code:'gu',label:'Gujarati'},{code:'kn',label:'Kannada'},{code:'ml',label:'Malayalam'},
  {code:'pa',label:'Punjabi'},{code:'or',label:'Odia'},{code:'as',label:'Assamese'},{code:'ur',label:'Urdu'},
  {code:'sd',label:'Sindhi'},{code:'ne',label:'Nepali'},{code:'ks',label:'Kashmiri'},{code:'sa',label:'Sanskrit'},
  {code:'mai',label:'Maithili'},{code:'kok',label:'Konkani'},{code:'doi',label:'Dogri'},{code:'bho',label:'Bhojpuri'},
  {code:'mni',label:'Manipuri'},{code:'en',label:'English'},
];

const TranslateTool = () => {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('hi');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const { translate, translating, error } = useTranslate();

  const handleTranslate = async () => {
    if (!text.trim()) return;
    try { const r = await translate(text, targetLang); setResult(r); }
    catch { /* error handled by hook */ }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="translate-section">
      <div className="translate-container">
        <motion.div className="translate-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Languages size={28} style={{ color: '#8b5cf6' }} />
          <h1>Translate Tool</h1>
          <p>Translate election content into 22 Indian languages</p>
        </motion.div>
        <div className="translate-grid">
          <div className="translate-panel">
            <div className="panel-top"><span className="panel-label">Input (English)</span></div>
            <textarea placeholder="Enter text to translate..." value={text} onChange={e => setText(e.target.value)} rows={6} />
          </div>
          <div className="translate-middle">
            <select value={targetLang} onChange={e => setTargetLang(e.target.value)} className="lang-select">
              {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <motion.button className="translate-btn" onClick={handleTranslate} disabled={translating || !text.trim()}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {translating ? <Loader2 size={20} className="spin" /> : <ArrowRightLeft size={20} />}
            </motion.button>
          </div>
          <div className="translate-panel">
            <div className="panel-top">
              <span className="panel-label">{LANGS.find(l => l.code === targetLang)?.label || 'Output'}</span>
              {result && (
                <button className="copy-btn" onClick={handleCopy}>
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            <div className="translate-output">{result || <span className="placeholder-text">Translation will appear here</span>}</div>
          </div>
        </div>
        {error && <div className="translate-error">{error}</div>}
      </div>
    </section>
  );
};
export default TranslateTool;

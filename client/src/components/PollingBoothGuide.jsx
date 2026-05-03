import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { findBooth } from '../services/api.js';
import './PollingBoothGuide.css';

const PollingBoothGuide = () => {
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault(); if (!address.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await findBooth(address, state);
      setResult(res.data);
    } catch (err) { setError(err.response?.data?.error || 'Could not find booth info'); }
    finally { setLoading(false); }
  };

  return (
    <section className="booth-section">
      <div className="booth-container">
        <motion.div className="booth-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <MapPin size={28} style={{ color: '#10b981' }} />
          <h1>Polling Booth Guide</h1>
          <p>Enter your address to find your nearest polling station</p>
        </motion.div>
        <motion.form className="booth-form" onSubmit={handleSearch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="booth-input-row">
            <input type="text" placeholder="Enter your address or area..." value={address} onChange={e => setAddress(e.target.value)} className="booth-input" />
            <input type="text" placeholder="State (optional)" value={state} onChange={e => setState(e.target.value)} className="booth-input-sm" />
            <motion.button type="submit" className="booth-search-btn" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} disabled={loading}>
              {loading ? <Loader2 size={18} className="spin" /> : <Search size={18} />}
              Search
            </motion.button>
          </div>
        </motion.form>
        {error && <div className="booth-error">{error}</div>}
        {result && (
          <motion.div className="booth-result ai-response-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3>📍 Your Polling Station</h3>
            <div className="booth-info-grid">
              {result.boothName && <div className="booth-info-item"><strong>Booth Name</strong><p>{result.boothName}</p></div>}
              {result.boothNumber && <div className="booth-info-item"><strong>Booth Number</strong><p>{result.boothNumber}</p></div>}
              {result.address && <div className="booth-info-item"><strong>Address</strong><p>{result.address}</p></div>}
              {result.constituency && <div className="booth-info-item"><strong>Constituency</strong><p>{result.constituency}</p></div>}
              {result.timings && <div className="booth-info-item"><strong>Timings</strong><p>{result.timings}</p></div>}
              {result.instructions && <div className="booth-info-item full-width"><strong>Instructions</strong><p>{result.instructions}</p></div>}
              {result.response && <div className="booth-info-item full-width"><strong>AI Guidance</strong><p>{result.response}</p></div>}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
export default PollingBoothGuide;

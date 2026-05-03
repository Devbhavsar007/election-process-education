import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Loader2, ArrowRight } from 'lucide-react';
import { runScenario } from '../services/api.js';
import './ScenarioSimulator.css';

const PRESETS = [
  'What if voter turnout exceeds 80% in urban areas?',
  'What if NOTA gets the majority votes in a constituency?',
  'What if EVMs are replaced by paper ballots nationwide?',
  'What if the minimum voting age is reduced to 16?',
  'What if simultaneous elections are held for Lok Sabha and all State Assemblies?',
];

const ScenarioSimulator = () => {
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); if (!scenario.trim()) return;
    setLoading(true); setResult(null);
    try {
      const res = await runScenario(scenario);
      setResult(res.data);
    } catch { setResult({ outcome: 'Could not generate scenario analysis. Please try again.' }); }
    finally { setLoading(false); }
  };

  return (
    <section className="scenario-section">
      <div className="scenario-container">
        <motion.div className="scenario-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <FlaskConical size={28} style={{ color: '#ec4899' }} />
          <h1>Scenario Simulator</h1>
          <p>"What if" election scenarios — AI generates constitutional & political outcomes</p>
        </motion.div>
        <div className="scenario-presets">
          {PRESETS.map((p, i) => (
            <motion.button key={i} className="preset-chip" onClick={() => setScenario(p)}
              whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>{p}</motion.button>
          ))}
        </div>
        <form className="scenario-form" onSubmit={handleSubmit}>
          <textarea placeholder="Describe a what-if election scenario..." value={scenario}
            onChange={e => setScenario(e.target.value)} rows={3} />
          <motion.button type="submit" className="scenario-submit" whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }} disabled={loading || !scenario.trim()}>
            {loading ? <><Loader2 size={18} className="spin" /> Analyzing...</> : <>Simulate <ArrowRight size={18} /></>}
          </motion.button>
        </form>
        {result && (
          <motion.div className="scenario-result ai-response-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3>🔮 Scenario Analysis</h3>
            <p>{result.outcome || result.response || JSON.stringify(result)}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
export default ScenarioSimulator;

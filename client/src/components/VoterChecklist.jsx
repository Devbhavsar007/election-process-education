import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getChecklist, updateChecklist } from '../services/api.js';
import './VoterChecklist.css';

const DEFAULT_ITEMS = [
  { id: 'voter-id', label: 'Obtain or verify Voter ID (EPIC card)', done: false },
  { id: 'electoral-roll', label: 'Check name on electoral roll (NVSP)', done: false },
  { id: 'constituency', label: 'Know your constituency and booth number', done: false },
  { id: 'candidates', label: 'Research candidates and their manifestos', done: false },
  { id: 'booth-location', label: 'Locate your polling booth on map', done: false },
  { id: 'documents', label: 'Keep valid photo ID ready for polling day', done: false },
  { id: 'timings', label: 'Know polling timings (7:00 AM to 6:00 PM)', done: false },
  { id: 'rights', label: 'Understand your rights as a voter', done: false },
];

const VoterChecklist = () => {
  const { user } = useAuth();
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      getChecklist(user._id).then(res => { if (res.data.items?.length) setItems(res.data.items); })
        .catch(() => {}).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  const toggleItem = async (id) => {
    const updated = items.map(i => i.id === id ? { ...i, done: !i.done } : i);
    setItems(updated);
    if (user?._id) { try { await updateChecklist(user._id, updated); } catch {} }
  };

  const done = items.filter(i => i.done).length;
  const pct = Math.round((done / items.length) * 100);

  if (loading) return <section className="checklist-section"><div className="journey-loading"><Loader2 size={32} className="spin" /><p>Loading checklist...</p></div></section>;

  return (
    <section className="checklist-section">
      <div className="checklist-container">
        <motion.div className="checklist-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <CheckSquare size={28} style={{ color: 'var(--success)' }} />
          <h1>Voter Checklist</h1>
          <p>Track your election readiness — {done}/{items.length} complete</p>
        </motion.div>
        <div className="checklist-progress-wrap">
          <div className="checklist-bar"><div className="checklist-bar-fill" style={{ width: `${pct}%` }} /></div>
          <span>{pct}%</span>
        </div>
        <div className="checklist-items">
          {items.map((item, i) => (
            <motion.div key={item.id} className={`checklist-item ${item.done ? 'done' : ''}`}
              onClick={() => toggleItem(item.id)} initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ x: 4 }} style={{ cursor: 'pointer' }}>
              <div className="check-icon">{item.done ? <Check size={18} /> : <Square size={18} />}</div>
              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default VoterChecklist;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flag, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getTimeline } from '../services/api.js';
import './ElectionTimeline.css';

const FALLBACK = [
  { date: 'Jan 15', title: 'Model Code of Conduct', desc: 'MCC comes into effect upon announcement of election schedule', icon: '📋' },
  { date: 'Feb 1', title: 'Nomination Filing', desc: 'Candidates file nominations with returning officers', icon: '📝' },
  { date: 'Feb 10', title: 'Scrutiny of Nominations', desc: 'Returning officers verify validity of filed nominations', icon: '🔍' },
  { date: 'Feb 20', title: 'Campaign Period', desc: 'Political campaigning, rallies, and public outreach begins', icon: '📢' },
  { date: 'Mar 1', title: 'Campaign Silence', desc: '48-hour silence period before polling day', icon: '🤫' },
  { date: 'Mar 3', title: 'Polling Day', desc: 'Voters cast ballots at designated polling stations (7AM-6PM)', icon: '🗳️' },
  { date: 'Mar 10', title: 'Counting Day', desc: 'EVMs opened and votes counted at designated centers', icon: '📊' },
  { date: 'Mar 12', title: 'Results Declaration', desc: 'Election Commission declares official results', icon: '🏆' },
];

const ElectionTimeline = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      getTimeline(user._id).then(res => setEvents(res.data.events || FALLBACK))
        .catch(() => setEvents(FALLBACK))
        .finally(() => setLoading(false));
    } else { setEvents(FALLBACK); setLoading(false); }
  }, [user]);

  if (loading) return <section className="timeline-section"><div className="journey-loading"><Loader2 size={32} className="spin" /><p>Loading timeline...</p></div></section>;

  return (
    <section className="timeline-section">
      <div className="timeline-container">
        <motion.div className="timeline-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Calendar size={28} style={{ color: 'var(--accent-secondary)' }} />
          <h1>Election Timeline</h1>
          <p>Key milestones in the electoral process</p>
        </motion.div>
        <div className="timeline-track">
          {events.map((ev, i) => (
            <motion.div key={i} className="timeline-event"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <div className="timeline-date-col">
                <span className="timeline-date">{ev.date}</span>
                <div className="timeline-dot-line">
                  <div className="tl-dot" />
                  {i < events.length - 1 && <div className="tl-line" />}
                </div>
              </div>
              <div className="timeline-card">
                <span className="tl-icon">{ev.icon}</span>
                <h3>{ev.title}</h3>
                <p>{ev.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ElectionTimeline;

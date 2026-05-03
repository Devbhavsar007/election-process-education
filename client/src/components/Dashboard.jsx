import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, MessageSquare, BookOpen, Languages, CheckSquare, BarChart3, Brain, Clock, Zap, ChevronRight, Vote } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getChecklist } from '../services/api.js';
import './Dashboard.css';

const quickActions = [
  { icon: <MessageSquare size={22} />, label: 'AI Chat', desc: 'Ask anything about elections', target: 'chat', color: '#3b82f6' },
  { icon: <Map size={22} />, label: 'Find Booth', desc: 'Locate your polling station', target: 'booth', color: '#10b981' },
  { icon: <BookOpen size={22} />, label: 'Take Quiz', desc: 'Test your election knowledge', target: 'quiz', color: '#f59e0b' },
  { icon: <Languages size={22} />, label: 'Translate', desc: 'Translate in 22 languages', target: 'translate', color: '#8b5cf6' },
  { icon: <Brain size={22} />, label: 'Scenario', desc: 'What-if election simulator', target: 'scenario', color: '#ec4899' },
  { icon: <Clock size={22} />, label: 'Timeline', desc: 'Election milestones', target: 'timeline', color: '#06b6d4' },
];

const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [checklistProgress, setChecklistProgress] = useState(0);

  useEffect(() => {
    if (user?._id) {
      getChecklist(user._id).then(res => {
        const items = res.data.items || [];
        const done = items.filter(i => i.done).length;
        setChecklistProgress(items.length ? Math.round((done / items.length) * 100) : 0);
      }).catch(() => {});
    }
  }, [user]);

  return (
    <section className="dashboard-section">
      <div className="dashboard-container">
        <motion.div className="dash-welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="dash-welcome-text">
            <h1>Welcome back, <span className="dash-name">{user?.name?.split(' ')[0] || 'Voter'}</span></h1>
            <p>Your personalized voter dashboard — powered by AI</p>
          </div>
          <div className="dash-progress-card">
            <div className="dash-progress-ring">
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="4" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="var(--accent-primary)" strokeWidth="4"
                  strokeDasharray={`${checklistProgress * 1.76} 176`} strokeLinecap="round"
                  transform="rotate(-90 32 32)" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
              </svg>
              <span className="progress-value">{checklistProgress}%</span>
            </div>
            <div><strong>Voter Readiness</strong><br /><span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Checklist progress</span></div>
          </div>
        </motion.div>

        <motion.div className="dash-journey-banner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onClick={() => onNavigate('journey')} style={{ cursor: 'pointer' }}>
          <div className="journey-banner-content">
            <Zap size={24} className="journey-icon" />
            <div>
              <h3>Continue Your Voter Journey</h3>
              <p>AI-generated step-by-step preparation path tailored for you</p>
            </div>
          </div>
          <ChevronRight size={20} />
        </motion.div>

        <h2 className="dash-section-title">Quick Actions</h2>
        <div className="dash-grid">
          {quickActions.map((a, i) => (
            <motion.div key={a.label} className="dash-action-card" onClick={() => onNavigate(a.target)}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5, ease: [0.21, 0.45, 0.32, 0.9] }}
              whileHover={{ y: -4, boxShadow: `0 8px 30px ${a.color}20` }}>
              <div className="dash-action-icon" style={{ background: `${a.color}15`, color: a.color }}>{a.icon}</div>
              <h3>{a.label}</h3>
              <p>{a.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="dash-bottom-row">
          <motion.div className="dash-checklist-preview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            onClick={() => onNavigate('checklist')} style={{ cursor: 'pointer' }}>
            <CheckSquare size={20} style={{ color: 'var(--accent-primary)' }} />
            <div><h4>Voter Checklist</h4><p>{checklistProgress}% complete — tap to manage</p></div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </motion.div>
          <motion.div className="dash-checklist-preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            onClick={() => onNavigate('analytics')} style={{ cursor: 'pointer' }}>
            <BarChart3 size={20} style={{ color: 'var(--accent-secondary)' }} />
            <div><h4>Analytics & Insights</h4><p>View quiz scores and activity</p></div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default Dashboard;

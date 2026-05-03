import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, MessageSquare, BookOpen, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getInsights } from '../services/api.js';
import './AnalyticsInsights.css';

const AnalyticsInsights = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      getInsights(user._id).then(res => setData(res.data))
        .catch(() => setData({ quizAvg: 0, totalChats: 0, journeyProgress: 0, checklistDone: 0, recentQuizzes: [] }))
        .finally(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  if (loading) return <section className="analytics-section"><div className="journey-loading"><Loader2 size={32} className="spin" /><p>Loading insights...</p></div></section>;

  const stats = [
    { icon: <BookOpen size={20} />, label: 'Quiz Average', value: `${data?.quizAvg || 0}%`, color: '#f59e0b' },
    { icon: <MessageSquare size={20} />, label: 'Chat Sessions', value: data?.totalChats || 0, color: '#3b82f6' },
    { icon: <TrendingUp size={20} />, label: 'Journey Progress', value: `${data?.journeyProgress || 0}%`, color: '#10b981' },
    { icon: <BarChart3 size={20} />, label: 'Checklist Done', value: `${data?.checklistDone || 0}%`, color: '#8b5cf6' },
  ];

  return (
    <section className="analytics-section">
      <div className="analytics-container">
        <motion.div className="analytics-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <BarChart3 size={28} style={{ color: 'var(--accent-secondary)' }} />
          <h1>Analytics & Insights</h1>
          <p>Your learning progress and activity overview</p>
        </motion.div>
        <div className="analytics-stats-grid">
          {stats.map((s, i) => (
            <motion.div key={i} className="analytics-stat-card" initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="stat-icon" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
              <div className="stat-data">
                <span className="stat-val">{s.value}</span>
                <span className="stat-lbl">{s.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
        {data?.recentQuizzes?.length > 0 && (
          <div className="analytics-recent">
            <h3>Recent Quiz Scores</h3>
            <div className="quiz-scores-list">
              {data.recentQuizzes.map((q, i) => (
                <div key={i} className="quiz-score-item">
                  <span className="qs-date">{new Date(q.takenAt).toLocaleDateString()}</span>
                  <div className="qs-bar-wrap"><div className="qs-bar" style={{ width: `${q.score}%` }} /></div>
                  <span className="qs-val">{q.score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default AnalyticsInsights;

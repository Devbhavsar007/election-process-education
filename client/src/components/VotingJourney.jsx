import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getJourney } from '../services/api.js';
import './VotingJourney.css';

const VotingJourney = () => {
  const { user } = useAuth();
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      getJourney(user._id).then(res => { setSteps(res.data.steps || []); })
        .catch(() => {
          setSteps([
            { title: 'Verify Voter Registration', description: 'Check if your name appears on the electoral roll via NVSP portal', completed: false },
            { title: 'Get Voter ID (EPIC)', description: 'Apply for or update your Voter ID card through Form 6', completed: false },
            { title: 'Know Your Constituency', description: 'Identify your Lok Sabha and Vidhan Sabha constituency boundaries', completed: false },
            { title: 'Research Candidates', description: 'Study candidate backgrounds, manifestos, and party positions', completed: false },
            { title: 'Locate Polling Booth', description: 'Find your assigned polling station and plan your route', completed: false },
            { title: 'Election Day Prep', description: 'Carry valid ID, know booth timings (7AM-6PM), and exercise your right', completed: false },
          ]);
        }).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  if (loading) {
    return (
      <section className="journey-section">
        <div className="journey-loading"><Loader2 size={32} className="spin" /> <p>Generating your personalized journey...</p></div>
      </section>
    );
  }

  return (
    <section className="journey-section">
      <div className="journey-container">
        <motion.div className="journey-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Compass size={28} style={{ color: 'var(--accent-primary)' }} />
          <h1>Your Voting Journey</h1>
          <p>AI-generated step-by-step voter preparation path</p>
        </motion.div>
        <div className="journey-timeline">
          {steps.map((step, i) => (
            <motion.div key={i} className={`journey-step ${step.completed ? 'completed' : ''}`}
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}>
              <div className="step-connector">
                <div className="step-dot">{step.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}</div>
                {i < steps.length - 1 && <div className="step-line" />}
              </div>
              <div className="step-card ai-response-card">
                <span className="step-number">Step {i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default VotingJourney;

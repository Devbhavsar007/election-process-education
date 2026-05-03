import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Vote, Shield, Brain, ArrowRight, Sparkles } from 'lucide-react';
import './HeroHeader.css';

const HeroHeader = ({ onStart }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scale = useTransform(smoothProgress, [0, 1], [1, 1.05]);
  const titleText = "The Future of Digital Democracy";
  const words = titleText.split(" ");

  return (
    <motion.section ref={containerRef} className="hero-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div className="hero-bg-orbs">
        <motion.div className="orb orb-blue" animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="orb orb-gold" animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      <motion.div className="badge-wrapper" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        <div className="badge-border-glow">
          <svg width="100%" height="100%" viewBox="0 0 260 40" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <rect x="1" y="1" width="258" height="38" rx="19" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <motion.rect x="1" y="1" width="258" height="38" rx="19" fill="none" stroke="url(#cbg)" strokeWidth="2.5" strokeDasharray="60 140" animate={{ strokeDashoffset: [0, -200] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }} />
            <defs><linearGradient id="cbg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="50%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs>
          </svg>
        </div>
        <div className="badge">
          <span className="badge-tag"><Sparkles size={10} /> LIVE</span>
          <span className="badge-text">AI-Powered Voter Platform — ECI Compliant</span>
        </div>
      </motion.div>

      <motion.h1 className="hero-title">
        {words.map((w, i) => (
          <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: i * 0.1, ease: [0.21, 0.45, 0.32, 0.9] }} style={{ display: 'inline-block', marginRight: '0.25em' }}>{w}</motion.span>
        ))}
      </motion.h1>

      <motion.p className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
        CivicVerse empowers every Indian voter with AI-guided preparation, real-time election insights, multilingual support in 22 languages, and personalized civic education.
      </motion.p>

      <div className="hero-actions" style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <motion.button className="btn btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onStart}>Start Your Voter Journey <ArrowRight size={18} /></motion.button>
        <motion.button className="btn btn-secondary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onStart}><Brain size={18} /> Try AI Chat</motion.button>
      </div>

      <motion.div className="hero-feature-pills" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
        <div className="feature-pill"><Vote size={14} /> 22 Languages</div>
        <div className="feature-pill"><Shield size={14} /> ECI Compliant</div>
        <div className="feature-pill"><Brain size={14} /> AI-Powered</div>
      </motion.div>

      <motion.div className="hero-stats" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}>
        <div className="stat-item"><span className="stat-value">950M+</span><span className="stat-label">Eligible Voters</span></div>
        <div className="stat-divider" />
        <div className="stat-item"><span className="stat-value">22</span><span className="stat-label">Languages</span></div>
        <div className="stat-divider" />
        <div className="stat-item"><span className="stat-value">AI</span><span className="stat-label">Dual Provider</span></div>
        <div className="stat-divider" />
        <div className="stat-item"><span className="stat-value">100%</span><span className="stat-label">Free & Open</span></div>
      </motion.div>
    </motion.section>
  );
};

export default HeroHeader;

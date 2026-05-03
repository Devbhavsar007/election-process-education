import React from 'react';
import { motion } from 'framer-motion';
import { CivicLogo } from './Navbar';
import './Footer.css';

const Footer = ({ onNavigate }) => {
  const cols = [
    { title: 'Platform', links: [
      { label: 'Dashboard', action: () => onNavigate?.('dashboard') },
      { label: 'AI Chat', action: () => onNavigate?.('chat') },
      { label: 'Quiz', action: () => onNavigate?.('quiz') },
      { label: 'Translate', action: () => onNavigate?.('translate') },
    ]},
    { title: 'Features', links: [
      { label: 'Voting Journey', action: () => onNavigate?.('journey') },
      { label: 'Booth Finder', action: () => onNavigate?.('booth') },
      { label: 'Scenario Lab', action: () => onNavigate?.('scenario') },
      { label: 'Timeline', action: () => onNavigate?.('timeline') },
    ]},
    { title: 'Resources', links: [
      { label: 'Voter Checklist', action: () => onNavigate?.('checklist') },
      { label: 'Analytics', action: () => onNavigate?.('analytics') },
      { label: 'ECI Website', action: null },
      { label: 'NVSP Portal', action: null },
    ]},
  ];

  return (
    <footer className="footer">
      <motion.div className="footer-main" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="footer-brand">
          <div className="footer-logo-wrapper"><CivicLogo /><span className="footer-logo-text">CivicVerse</span></div>
          <p>AI-powered election learning platform for the world's largest democracy. Empowering 950M+ voters with civic knowledge.</p>
        </div>
        <nav aria-label="Footer navigation" style={{ display: 'contents' }}>
        {cols.map((col, i) => (
          <div key={i} className="footer-column">
            <h4>{col.title}</h4>
            <ul className="footer-list">
              {col.links.map((link, li) => (
                <li key={li}>
                  {link.action ? (
                    <motion.button onClick={link.action}
                      style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '14px', textAlign: 'left' }}
                      whileHover={{ x: 4, color: '#fff' }}>{link.label}</motion.button>
                  ) : <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{link.label}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
        </nav>
      </motion.div>
      <div className="footer-bottom">
        <div className="footer-copyright">© {new Date().getFullYear()} CivicVerse. Built for Digital Democracy.</div>
        <div className="footer-status">
          <motion.div className="status-dot" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          <span>System Online</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

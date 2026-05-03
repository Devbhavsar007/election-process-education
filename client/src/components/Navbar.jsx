import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Globe, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import './Navbar.css';

const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' }, { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' }, { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' }, { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' }, { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'ଓଡ଼ିଆ' }, { code: 'as', label: 'অসমীয়া' },
  { code: 'ur', label: 'اردو' }, { code: 'sd', label: 'سنڌي' },
  { code: 'ne', label: 'नेपाली' }, { code: 'ks', label: 'कॉशुर' },
  { code: 'sa', label: 'संस्कृत' }, { code: 'mai', label: 'मैथिली' },
  { code: 'kok', label: 'कोंकणी' }, { code: 'doi', label: 'डोगरी' },
  { code: 'bho', label: 'भोजपुरी' }, { code: 'mni', label: 'মৈতৈলোন্' },
];

export const CivicLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="42" stroke="url(#logo-grad)" strokeWidth="6" fill="none" />
    <path d="M50 20 L50 50 L70 60" stroke="url(#logo-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="50" cy="50" r="6" fill="#f59e0b" />
    <path d="M30 75 L50 85 L70 75" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" fill="none" />
    <defs>
      <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
  </svg>
);

const Navbar = ({ onNavigate, currentView = 'landing' }) => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState(currentView);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => { setActiveItem(currentView); }, [currentView]);
  useEffect(() => { return scrollY.on("change", (v) => setScrolled(v > 50)); }, [scrollY]);

  const navItems = user
    ? [
        { label: 'Dashboard', target: 'dashboard' },
        { label: 'Journey', target: 'journey' },
        { label: 'AI Chat', target: 'chat' },
        { label: 'Quiz', target: 'quiz' },
        { label: 'Translate', target: 'translate' },
      ]
    : [
        { label: 'Home', target: 'landing' },
        { label: 'Features', target: 'features' },
      ];

  const handleLogout = async () => {
    await logout();
    onNavigate('landing');
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] }}
      aria-label="Main navigation"
      role="navigation"
    >
      <motion.button
        className="nav-left"
        onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: 0 }}
        whileHover={{ opacity: 0.8 }}
      >
        <CivicLogo />
        <span className="logo-text">CivicVerse</span>
      </motion.button>

      <div className="nav-center">
        {navItems.map((item) => {
          const isActive = activeItem === item.target;
          return (
            <motion.button
              key={item.label}
              onClick={() => { setActiveItem(item.target); onNavigate(item.target); }}
              className="nav-link"
              style={{
                position: 'relative', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--sans)', fontSize: '14px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                padding: '8px 12px'
              }}
              whileHover={{ y: isActive ? 0 : -1, color: '#60a5fa' }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="navbar-active-indicator"
                  style={{
                    position: 'absolute', bottom: 0, left: '10%', right: '10%',
                    height: '2px', background: 'var(--accent-primary)', borderRadius: '2px'
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Language Selector */}
        <div className="lang-selector" style={{ position: 'relative' }}>
          <motion.button
            className="lang-btn"
            onClick={() => setLangOpen(!langOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-expanded={langOpen}
            aria-haspopup="listbox"
            aria-label={`Language selector: ${LANGUAGES.find(l => l.code === selectedLang)?.label || 'English'}`}
          >
            <Globe size={16} />
            <span>{LANGUAGES.find(l => l.code === selectedLang)?.label || 'EN'}</span>
            <ChevronDown size={12} />
          </motion.button>
          {langOpen && (
            <motion.div
              className="lang-dropdown"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              role="listbox"
              aria-label="Select language"
            >
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  className={`lang-option ${selectedLang === l.code ? 'active' : ''}`}
                  onClick={() => { setSelectedLang(l.code); setLangOpen(false); }}
                  role="option"
                  aria-selected={selectedLang === l.code}
                >
                  {l.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {user ? (
          <>
            <motion.button
              className="nav-avatar-btn"
              whileHover={{ scale: 1.05 }}
              onClick={() => onNavigate('analytics')}
            >
              <User size={18} />
              <span className="nav-user-name">{user.name?.split(' ')[0] || 'User'}</span>
            </motion.button>
            <motion.button
              className="sign-in-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          </>
        ) : (
          <motion.button
            className="sign-in-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('auth')}
          >
            Get Started
            <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;

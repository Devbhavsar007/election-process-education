import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import './AuthPage.css';

const ParticleGrid = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const particles = useRef([]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; init(); };
    const init = () => {
      particles.current = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5, speedX: Math.random() * 0.3 - 0.15,
        speedY: Math.random() * 0.3 - 0.15, life: Math.random()
      }));
    };
    const onMouse = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    resize();
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gs = 40;
      const cols = Math.ceil(canvas.width / gs);
      const rows = Math.ceil(canvas.height / gs);
      const ox = (mouse.current.x - canvas.width / 2) * 0.03;
      const oy = (mouse.current.y - canvas.height / 2) * 0.03;
      for (let i = -1; i <= cols + 1; i++) {
        for (let j = -1; j <= rows + 1; j++) {
          const x = i * gs + ox, y = j * gs + oy;
          const d = Math.sqrt((mouse.current.x - x) ** 2 + (mouse.current.y - y) ** 2);
          const o = Math.pow(Math.max(0, 1 - d / 350), 3);
          if (o > 0.001) {
            ctx.fillStyle = `rgba(59,130,246,${o * 0.8})`;
            ctx.beginPath(); ctx.arc(x, y, 2.5 * o + 0.5, 0, Math.PI * 2); ctx.fill();
          } else {
            ctx.fillStyle = 'rgba(255,255,255,0.03)';
            ctx.beginPath(); ctx.arc(x, y, 0.5, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      particles.current.forEach(p => {
        p.x += p.speedX; p.y += p.speedY; p.life += 0.003;
        if (p.life > 1) p.life = 0;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        const d2 = Math.sqrt((mouse.current.x - p.x) ** 2 + (mouse.current.y - p.y) ** 2);
        const inf = Math.max(0, 1 - d2 / 300);
        const po = Math.sin(p.life * Math.PI) * 0.15 + inf * 0.5;
        ctx.fillStyle = `rgba(245,158,11,${po})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size + inf * 2, 0, Math.PI * 2); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMouse); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0 }} />;
};

const AuthPage = ({ onBack, onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMouseMove = ({ clientX, clientY }) => {
    mouseX.set((clientX / window.innerWidth) - 0.5);
    mouseY.set((clientY / window.innerHeight) - 0.5);
  };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 100, damping: 30 });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (isLogin) { await login(email, password); }
      else { await register(name, email, password); }
      onNavigate('dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(''); setLoading(true);
    try {
      const res = await loginWithGoogle();
      onNavigate(res.isNewUser ? 'complete-profile' : 'dashboard');
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page" onMouseMove={handleMouseMove}>
      <ParticleGrid />
      <motion.div className="auth-container"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] }}>
        <div className="auth-header" style={{ transform: "translateZ(50px)" }}>
          <span className="auth-logo">CivicVerse</span>
          <AnimatePresence mode="wait">
            <motion.h2 key={isLogin ? 'l' : 's'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="auth-title">
              {isLogin ? 'Welcome Back' : 'Join CivicVerse'}
            </motion.h2>
          </AnimatePresence>
          <p className="auth-subtitle">{isLogin ? 'Sign in to your voter dashboard.' : 'Start your digital democracy journey.'}</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit} style={{ transform: "translateZ(30px)" }}>
          {!isLogin && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
            </motion.div>
          )}
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <motion.button className="auth-submit-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>
        <div className="sso-divider" style={{ transform: "translateZ(20px)" }}><span>or</span></div>
        <div className="sso-buttons" style={{ transform: "translateZ(20px)" }}>
          <motion.button whileHover={{ y: -2 }} className="sso-btn" onClick={handleGoogle} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </motion.button>
        </div>
        <div className="auth-footer" style={{ transform: "translateZ(10px)" }}>
          {isLogin ? "New to CivicVerse?" : "Have an account?"}
          <button className="auth-toggle-link" onClick={() => { setIsLogin(!isLogin); setError(''); }}>{isLogin ? 'Sign Up' : 'Sign In'}</button>
        </div>
        <button onClick={onBack} className="back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Return to home
        </button>
      </motion.div>
    </div>
  );
};

export default AuthPage;

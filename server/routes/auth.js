import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { authenticate, generateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { verifyFirebaseToken } from '../config/firebase.js';

const router = Router();
router.use(authLimiter);

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, profileComplete: user.profileComplete } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken(user._id);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, state: user.state, constituency: user.constituency, preferredLang: user.preferredLang, profileComplete: user.profileComplete } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'idToken required' });
    const decoded = await verifyFirebaseToken(idToken);
    let user = await User.findOne({ firebaseUID: decoded.uid });
    let isNewUser = false;
    if (!user) {
      user = await User.findOne({ email: decoded.email });
      if (user) { user.firebaseUID = decoded.uid; await user.save(); }
      else {
        user = await User.create({ name: decoded.name || decoded.email.split('@')[0], email: decoded.email, firebaseUID: decoded.uid });
        isNewUser = true;
      }
    }
    const token = generateToken(user._id);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, profileComplete: user.profileComplete }, isNewUser });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/auth/complete-profile
router.post('/complete-profile', authenticate, async (req, res) => {
  try {
    const { age, state, constituency, preferredLang } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { age, state, constituency, preferredLang, profileComplete: true }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { _id: user._id, name: user.name, email: user.email, state: user.state, constituency: user.constituency, preferredLang: user.preferredLang, profileComplete: true } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;

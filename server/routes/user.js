import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import Checklist from '../models/Checklist.js';

const router = Router();

const DEFAULT_CHECKLIST = [
  { id: 'voter-id', label: 'Obtain or verify Voter ID (EPIC card)', done: false },
  { id: 'electoral-roll', label: 'Check name on electoral roll (NVSP)', done: false },
  { id: 'constituency', label: 'Know your constituency and booth number', done: false },
  { id: 'candidates', label: 'Research candidates and their manifestos', done: false },
  { id: 'booth-location', label: 'Locate your polling booth on map', done: false },
  { id: 'documents', label: 'Keep valid photo ID ready for polling day', done: false },
  { id: 'timings', label: 'Know polling timings (7:00 AM to 6:00 PM)', done: false },
  { id: 'rights', label: 'Understand your rights as a voter', done: false },
];

// POST /api/user/init
router.post('/init', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    let checklist = await Checklist.findOne({ userId: req.userId });
    if (!checklist) {
      checklist = await Checklist.create({ userId: req.userId, items: DEFAULT_CHECKLIST });
    }
    res.json({ user, checklist });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/user/:userId
router.get('/:userId', authenticate, async (req, res) => {
  try {
    // Authorization: only allow users to access their own profile
    if (req.params.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const user = await User.findById(req.params.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;

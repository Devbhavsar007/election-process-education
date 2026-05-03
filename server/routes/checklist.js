import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import Checklist from '../models/Checklist.js';

const router = Router();

// GET /api/checklist/:userId
router.get('/:userId', authenticate, async (req, res) => {
  try {
    let checklist = await Checklist.findOne({ userId: req.params.userId });
    if (!checklist) {
      checklist = await Checklist.create({
        userId: req.params.userId,
        items: [
          { id: 'voter-id', label: 'Obtain or verify Voter ID (EPIC card)', done: false },
          { id: 'electoral-roll', label: 'Check name on electoral roll (NVSP)', done: false },
          { id: 'constituency', label: 'Know your constituency and booth number', done: false },
          { id: 'candidates', label: 'Research candidates and their manifestos', done: false },
          { id: 'booth-location', label: 'Locate your polling booth on map', done: false },
          { id: 'documents', label: 'Keep valid photo ID ready for polling day', done: false },
          { id: 'timings', label: 'Know polling timings (7:00 AM to 6:00 PM)', done: false },
          { id: 'rights', label: 'Understand your rights as a voter', done: false },
        ]
      });
    }
    res.json({ items: checklist.items });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/checklist/update
router.post('/update', authenticate, async (req, res) => {
  try {
    const { userId, items } = req.body;
    if (!userId || !items) return res.status(400).json({ error: 'userId and items required' });
    const checklist = await Checklist.findOneAndUpdate(
      { userId },
      { items },
      { new: true, upsert: true }
    );
    res.json({ items: checklist.items });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;

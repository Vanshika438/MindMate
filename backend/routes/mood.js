const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const auth = require('../middleware/authMiddleware');

// POST /api/mood – Save mood
router.post('/', auth, async (req, res) => {
  try {
    const { mood, note } = req.body;
    const newMood = new Mood({ user: req.user.id, mood, note });
    await newMood.save();
    res.status(201).json(newMood);
  } catch (err) {
    res.status(500).json({ error: 'Mood save failed' });
  }
});

// GET /api/mood – Get user moods
router.get('/', auth, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
});

module.exports = router;

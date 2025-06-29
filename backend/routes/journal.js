const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Journal = require('../models/Journal');

// Get all journal entries for the user
router.get('/', authMiddleware, async (req, res) => {
  const entries = await Journal.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(entries);
});

// Create new journal entry
router.post('/', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const entry = new Journal({ user: req.user.id, content });
  await entry.save();
  res.status(201).json(entry);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Journal = require('../models/Journal');
const axios = require('axios');

router.post('/suggest', authMiddleware, async (req, res) => {
  try {
    const journal = await Journal.findOne({ user: req.user.id }).sort({ createdAt: -1 });

    if (!journal) {
      return res.status(404).json({ message: 'No journal entry found.' });
    }

    const prompt = `This is my journal entry: "${journal.content}". 
    Give me 3 personalized mental health suggestions to feel better.`;

    const API_KEY = process.env.GEMINI_API_KEY;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const suggestion =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No suggestion returned';

    res.json({ suggestions: suggestion });
  } catch (err) {
    console.error('AI Suggestion API error:', err.message);
    res.status(500).json({ message: 'AI suggestion failed' });
  }
});

module.exports = router;

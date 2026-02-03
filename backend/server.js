// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');
const aiRoutes = require('./routes/ai');
const moodRoutes = require('./routes/mood');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/mood', moodRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('MindMate backend is running');
});

// Check Gemini API key
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY is not set!');
}

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));

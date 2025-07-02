import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/MoodTracker.css';

const MoodTracker = () => {
  const { token, user } = useAuth();
  const [selectedMood, setSelectedMood] = useState('');
  const [moods, setMoods] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState('');

  const moodOptions = [
    { value: 'Ecstatic', emoji: '😁', color: '#f39c12' },
    { value: 'Happy', emoji: '😊', color: '#f1c40f' },
    { value: 'Content', emoji: '🙂', color: '#2ecc71' },
    { value: 'Neutral', emoji: '😐', color: '#95a5a6' },
    { value: 'Tired', emoji: '😴', color: '#3498db' },
    { value: 'Anxious', emoji: '😟', color: '#e67e22' },
    { value: 'Sad', emoji: '😔', color: '#9b59b6' },
    { value: 'Angry', emoji: '😠', color: '#e74c3c' }
  ];

  const fetchMoods = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/mood`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMoods(res.data);
    } catch (err) {
      console.error('Failed to fetch moods:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchMoods();
  }, [fetchMoods]);

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    setIsSubmitting(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/mood`,
        { mood: selectedMood, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedMood('');
      setNote('');
      fetchMoods();
    } catch (err) {
      console.error('Failed to submit mood:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodData = (moodValue) => {
    return moodOptions.find(option => option.value === moodValue) || 
           { emoji: '❓', color: '#95a5a6' };
  };

  return (
    <div className="mood-container">
      <div className="mood-header">
        <h2>🌦️ Mood Weather</h2>
        <p className="welcome-message">
          Hello, {user?.name || 'friend'}. How are you feeling today?
        </p>
      </div>

      <form onSubmit={handleMoodSubmit} className="mood-form">
        <div className="mood-selector">
          {moodOptions.map((mood) => (
            <div
              key={mood.value}
              className={`mood-option ${selectedMood === mood.value ? 'selected' : ''}`}
              onClick={() => setSelectedMood(mood.value)}
              style={{ backgroundColor: mood.color }}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.value}</span>
            </div>
          ))}
        </div>

        <div className="mood-note">
          <textarea
            placeholder="Add a note about why you're feeling this way (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="3"
          />
        </div>

        <button 
          type="submit" 
          disabled={!selectedMood || isSubmitting}
          className="submit-btn"
        >
          {isSubmitting ? 'Saving...' : 'Log My Mood'}
        </button>
      </form>

      <div className="mood-history">
        <h3>Your Mood History</h3>
        {moods.length === 0 ? (
          <div className="empty-state">
            <p>No mood entries yet. Track your first mood!</p>
          </div>
        ) : (
          <div className="mood-timeline">
            {moods.map((item) => {
              const moodData = getMoodData(item.mood);
              return (
                <div key={item._id} className="mood-entry" style={{ borderLeftColor: moodData.color }}>
                  <div className="mood-entry-header">
                    <span className="mood-emoji">{moodData.emoji}</span>
                    <span className="mood-value">{item.mood}</span>
                    <span className="mood-date">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {item.note && <p className="mood-note-text">{item.note}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Journal.css';

const Journal = () => {
  const { token, user } = useAuth();
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prompt, setPrompt] = useState('');

  // Prompts for journaling
  const prompts = [
    "What are you grateful for today?",
    "What emotions are you feeling right now?",
    "What challenged you today?",
    "What made you smile today?",
    "What would you like to let go of?",
    "What are you looking forward to?"
  ];

  useEffect(() => {
    // Set a random prompt when component mounts
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    
    const fetchEntries = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/journal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(res.data);
      } catch (err) {
        console.error('Failed to fetch journal entries:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchEntries();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entry.trim()) return;

    try {
      setIsLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/journal`,
        { content: entry },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEntry('');
      
      // Get new prompt after submission
      setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
      
      // Re-fetch entries
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/journal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data);
    } catch (err) {
      console.error('Failed to save entry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPrompt = () => {
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h2>📝 Journal Your Thoughts</h2>
        <p className="welcome-message">Hello, {user?.name || 'friend'}. Take a moment to reflect.</p>
      </div>

      <div className="journal-content">
        <form onSubmit={handleSubmit} className="journal-form">
          <div className="prompt-section">
            <p className="prompt-text">{prompt}</p>
            <button 
              type="button" 
              className="new-prompt-btn"
              onClick={handleNewPrompt}
            >
              New Prompt
            </button>
          </div>
          <textarea
            rows="6"
            placeholder="Write your thoughts here..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            required
          />
          <div className="form-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Entry'}
            </button>
            <span className="char-count">{entry.length}/1000</span>
          </div>
        </form>

        <div className="journal-entries">
          <h3>Your Journal History</h3>
          {isLoading && entries.length === 0 ? (
            <div className="loading-spinner"></div>
          ) : entries.length === 0 ? (
            <p className="no-entries">No journal entries yet. Start writing!</p>
          ) : (
            <div className="entries-list">
              {entries.map((item) => (
                <div key={item._id} className="entry-card">
                  <p className="entry-content">{item.content}</p>
                  <div className="entry-footer">
                    <span className="entry-date">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="entry-mood">{item.mood || '🌱'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
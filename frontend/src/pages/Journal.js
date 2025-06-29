import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Journal.css';
import '../styles/main.css';

const Journal = () => {
  const { token } = useAuth();
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/journal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(res.data);
      } catch (err) {
        console.error('Failed to fetch journal entries:', err);
      }
    };

    if (token) {
      fetchEntries();
    }
  }, [token]); // ✅ token added as dependency

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entry.trim()) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/journal`,
        { content: entry },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEntry('');

      // ✅ Re-fetch entries after successful post
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/journal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data);

    } catch (err) {
      console.error('Failed to save entry:', err);
    }
  };

  return (
    <div className="journal-container">
      <h2>📝 Journal Your Thoughts</h2>

      <form onSubmit={handleSubmit} className="journal-form">
        <textarea
          rows="5"
          placeholder="What's on your mind today?"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          required
        />
        <button type="submit">Save Entry</button>
      </form>

      <div className="journal-entries">
        <h3>Past Entries</h3>
        {entries.length === 0 ? (
          <p>No journal entries yet.</p>
        ) : (
          entries.map((item) => (
            <div key={item._id} className="entry">
              <p>{item.content}</p>
              <span className="entry-date">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;

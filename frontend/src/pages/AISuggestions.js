import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import '../styles/AISuggestions.css';

const AISuggestions = () => {
  const { token, user } = useAuth();
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [suggestionType, setSuggestionType] = useState('general');

  const suggestionTypes = [
    { id: 'general', label: 'General Wellness', emoji: '🌿' },
    { id: 'mindfulness', label: 'Mindfulness', emoji: '🧘‍♂️' },
    { id: 'productivity', label: 'Productivity', emoji: '📈' },
    { id: 'sleep', label: 'Sleep', emoji: '😴' },
    { id: 'relationships', label: 'Relationships', emoji: '💞' }
  ];

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/ai/suggest`,
        { type: suggestionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuggestions(res.data.suggestions);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setError('Failed to get suggestions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear suggestions when changing type
    setSuggestions('');
  }, [suggestionType]);

  return (
    <div className="ai-suggestions-container">
      <div className="ai-header">
        <h2>✨ Your AI Wellness Guide</h2>
        <p className="welcome-message">
          Hello, {user?.name || 'friend'}. Let's explore some personalized suggestions for your wellbeing.
        </p>
      </div>

      <div className="suggestion-types">
        {suggestionTypes.map((type) => (
          <button
            key={type.id}
            className={`type-btn ${suggestionType === type.id ? 'active' : ''}`}
            onClick={() => setSuggestionType(type.id)}
            disabled={loading}
          >
            {type.emoji} {type.label}
          </button>
        ))}
      </div>

      <div className="action-section">
        <button 
          onClick={fetchSuggestions} 
          disabled={loading}
          className="fetch-btn"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Analyzing your patterns...
            </>
          ) : (
            `Get ${suggestionTypes.find(t => t.id === suggestionType).label} Suggestions`
          )}
        </button>
        {lastUpdated && !loading && (
          <p className="last-updated">Last updated: {lastUpdated}</p>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {suggestions && (
        <div className={`suggestions-box ${loading ? 'loading' : ''}`}>
          <div className="suggestion-header">
            <h3>
              {suggestionTypes.find(t => t.id === suggestionType).emoji}{' '}
              {suggestionTypes.find(t => t.id === suggestionType).label} Suggestions
            </h3>
          </div>
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="markdown-p" {...props} />,
                strong: ({ node, ...props }) => <strong className="markdown-strong" {...props} />,
                em: ({ node, ...props }) => <em className="markdown-em" {...props} />,
                ul: ({ node, ...props }) => <ul className="markdown-ul" {...props} />,
                ol: ({ node, ...props }) => <ol className="markdown-ol" {...props} />,
                li: ({ node, ...props }) => <li className="markdown-li" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="markdown-blockquote" {...props} />
              }}
            >
              {suggestions}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {!suggestions && !loading && (
        <div className="empty-state">
          <div className="empty-icon">💡</div>
          <h3>No suggestions yet</h3>
          <p>Select a category and click the button to get personalized AI recommendations based on your journal entries.</p>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;
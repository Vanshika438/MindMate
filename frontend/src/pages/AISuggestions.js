import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AISuggestions.css';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';


const AISuggestions = () => {
  const { token } = useAuth();
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/ai/suggest`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setSuggestions('Failed to get suggestions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-suggestions-container">
      <h2>🧠 AI-Powered Suggestions</h2>
      <p>Click below to get mental wellness advice based on your latest journal entry.</p>
      <button onClick={fetchSuggestions} disabled={loading}>
        {loading ? 'Thinking...' : 'Get Suggestions'}
      </button>
      {suggestions && (
        <div className="suggestions-box">
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => <p style={{ marginBottom: '1em' }} {...props} />,
              strong: ({ node, ...props }) => <strong className="markdown-strong" {...props} />,
              em: ({ node, ...props }) => <em className="markdown-em" {...props} />,
              li: ({ node, ...props }) => <li className="markdown-li" {...props} />
            }}
          >
            {suggestions}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;

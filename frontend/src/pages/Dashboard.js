import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>
          Welcome back, {user?.name || 'User'}! <span className="emoji">🧠</span>
        </h1>
        <p className="subtitle">Your mental wellness journey starts here</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card mood-card">
          <h3>Mood Tracker</h3>
          <p>Track your daily emotions</p>
          <button
            className="dashboard-btn"
            onClick={() => navigate('/mood')}
          >
            View Insights
          </button>
        </div>

        <div className="stat-card journal-card">
          <h3>Journal Entries</h3>
          <p>Reflect on your thoughts</p>
          <button
            className="dashboard-btn"
            onClick={() => navigate('/journal')}
          >
            Write New Entry
          </button>
        </div>

        <div className="stat-card ai-card">
          <h3>AI Suggestions</h3>
          <p>Personalized recommendations</p>
          <button
            className="dashboard-btn"
            onClick={() => navigate('/ai')}
          >
            Get Suggestions
          </button>
        </div>

        <div className="stat-card progress-card">
          <h3>Your Progress</h3>
          <p>See how far you've come</p>
          <button
            className="dashboard-btn"
            onClick={() => navigate('/profile')}
          >
            View Progress
          </button>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn breath-btn">
            Breathing Exercise
          </button>
          <button className="action-btn meditate-btn">
            5-Min Meditation
          </button>
          <button className="action-btn emergency-btn">
            Emergency Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

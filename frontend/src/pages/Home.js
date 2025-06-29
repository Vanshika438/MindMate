import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Nurture Your Mind <span className="emoji">🌱</span></h1>
          <p className="tagline">A gentle space for mood tracking, reflection, and growth</p>
          
          <div className="cta-buttons">
            <Link to={user ? "/dashboard" : "/auth"} className="cta-btn">
              {user ? "Continue Your Journey" : "Begin Healing"}
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Your Wellness Toolkit</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📓</div>
            <h3>Guided Journal</h3>
            <p>Thoughtful prompts to help you process emotions and experiences.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌦️</div>
            <h3>Mood Weather</h3>
            <p>Track your emotional climate with our intuitive mood mapping.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Gentle Insights</h3>
            <p>AI-powered reflections that help you see patterns with compassion.</p>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <h2>Ready to cultivate mental wellness?</h2>
        <Link to={user ? "/journal" : "/auth"} className="cta-btn">
          {user ? "Write Today's Entry" : "Start Your Free Journal"}
        </Link>
      </section>
    </div>
  );
}

export default Home;
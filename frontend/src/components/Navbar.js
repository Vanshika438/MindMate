import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitial = () => user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">MindMate</Link>
      </div>

      {user ? (
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/mood">Mood Tracker</Link>
          <Link to="/ai-suggestions">AI Suggestions</Link>


          <div className="user-section">
            <div className="user-circle">{getInitial()}</div>
            <div className="dropdown">
              <Link to="/profile">My Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="auth-link">
          <Link to="/auth">Login / Signup</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setShowDropdown(false);
    document.body.style.overflow = 'auto';
  };

  const getInitial = () => user?.name?.charAt(0).toUpperCase() || '?';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
    setShowDropdown(false); // Close dropdown when menu toggles
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setShowDropdown(false);
    document.body.style.overflow = 'auto';
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>MindMate</Link>
        </div>

        <button
          className={`hamburger ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <div className={`nav-content ${isMenuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <div className="nav-links">
                <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                <Link to="/journal" onClick={closeMenu}>Journal</Link>
                <Link to="/mood" onClick={closeMenu}>Mood Tracker</Link>
                <Link to="/ai/suggest" onClick={closeMenu}>AI Suggestions</Link>
              </div>

              <div className="user-section" onClick={toggleDropdown}>
                <div className="user-circle">{getInitial()}</div>
                <div className={`dropdown ${showDropdown ? 'show' : ''}`}>
                  <Link to="/profile" onClick={closeMenu}>My Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-link">
              <Link to="/auth" onClick={closeMenu}>Login / Signup</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

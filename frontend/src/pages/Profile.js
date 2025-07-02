import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();

  // Function to extract initials from name
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div 
            className="profile-avatar"
            style={{ backgroundColor: '#6267E3' }}
          >
            {getInitials(user?.name)}
          </div>
          
          <div className="profile-info">
            <h3 className="profile-name">
              {user?.name || 'Anonymous User'}
            </h3>
            <p className="profile-email">
              {user?.email || 'No email provided'}
            </p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-icon">👤</span>
            <span className="detail-label">Full Name:</span>
            <span className="detail-value">{user?.name || 'Not specified'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">✉️</span>
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user?.email}</span>
          </div>

          <div className="detail-item">
            <span className="detail-icon">🛡️</span>
            <span className="detail-label">Account Status:</span>
            <span className="detail-value verified">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
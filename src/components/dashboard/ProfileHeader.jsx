// src/components/dashboard/ProfileHeader.jsx

import React from 'react';
import './ProfileHeader.css';

const ProfileHeader = ({ profile, stats }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="profile-header">
      <div className="profile-avatar">
        <span>{getInitials(profile.full_name)}</span>
      </div>
      <div className="profile-info">
        <h1 className="profile-name">{profile.full_name}</h1>
        <p className="profile-email">{profile.email}</p>
      </div>
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{profile.level}</span>
          <span className="stat-label">Nível</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{profile.total_xp}</span>
          <span className="stat-label">XP</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.achievementsCount}</span>
          <span className="stat-label">Selos</span>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
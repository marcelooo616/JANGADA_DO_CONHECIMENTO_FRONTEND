// src/components/dashboard/AchievementBadge.jsx
import React from 'react';
import './AchievementBadge.css';

const AchievementBadge = ({ achievement }) => {
  // Se não houver um ícone customizado, usamos um padrão
  const icon = achievement.icon_url ? (
    <img src={achievement.icon_url} alt={achievement.name} />
  ) : (
    <i className="fas fa-trophy"></i>
  );

  return (
    <div className="achievement-badge" title={`${achievement.name}: ${achievement.description}`}>
      <div className="achievement-icon-container">
        {icon}
      </div>
      <span className="achievement-name">{achievement.name}</span>
    </div>
  );
};

export default AchievementBadge;
import React from 'react';
import AchievementBadge from './AchievementBadge';
import './AchievementsList.css';

const AchievementsList = ({ achievements }) => {
  return (
    <section className="achievements-section">
      <h2 className="section-title">Minhas Conquistas</h2>
      {achievements.length > 0 ? (
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      ) : (
        <p className="no-achievements-message">Continue aprendendo para desbloquear suas primeiras conquistas!</p>
      )}
    </section>
  );
};

export default AchievementsList;
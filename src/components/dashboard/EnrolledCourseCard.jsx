import React from 'react';
import { Link } from 'react-router-dom';
import './EnrolledCourseCard.css'; // Criaremos a seguir

const EnrolledCourseCard = ({ enrollment }) => {
  const { Course: course, progress } = enrollment;
  const coverImage = course.cover_image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600';

  return (
    <div className="enrolled-course-card">
      <img src={coverImage} alt={course.title} className="enrolled-course-image" />
      <div className="enrolled-course-info">
        <span className="enrolled-course-category">{course.Category?.name || 'Geral'}</span>
        <h4 className="enrolled-course-title">{course.title}</h4>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress || 0}%` }} // A mágica da barra de progresso
          ></div>
        </div>
        <div className="progress-bar-text">
          <span>{progress || 0}% concluído</span>
          <Link to={`/cursos/${course.id}/aula/1`} className="continue-link"> {/* TODO: Link para a próxima aula */}
            Continuar <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;
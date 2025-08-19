import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css'; // Criaremos a seguir

const CourseCard = ({ course }) => {
  // URL de imagem placeholder, caso o curso não tenha uma
  const coverImage = course.cover_image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600';

  return (
    <Link to={`/cursos/${course.id}`} className="course-card">
      <div className="course-card-image-container">
        <img src={coverImage} alt={`Capa do curso ${course.title}`} className="course-card-image" />
      </div>
      <div className="course-card-content">
        <span className="course-card-category">{course.Category?.name || 'Geral'}</span>
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-instructor">
          <i className="fas fa-user-tie"></i>
          {course.instructor?.full_name || 'Admin'}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
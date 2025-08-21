import React from 'react';
import EnrolledCourseCard from './EnrolledCourseCard';
import './EnrolledCoursesList.css';

const EnrolledCoursesList = ({ courses }) => {
  return (
    <section className="enrolled-courses-section">
      <h2 className="section-title">Meus Cursos</h2>
      {courses.length > 0 ? (
        <div className="enrolled-courses-grid">
          {courses.map(enrollment => (
            <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      ) : (
        <p className="no-courses-message">Você ainda não se matriculou em nenhum curso.</p>
      )}
    </section>
  );
};

export default EnrolledCoursesList;
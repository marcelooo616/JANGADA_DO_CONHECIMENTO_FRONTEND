import React from 'react';
import { useParams, Outlet, NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/axiosConfig';
import './CoursePlayerLayout.css';

import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";

// Funções de API
const fetchCourseById = async (courseId) => {
  const { data } = await apiClient.get(`/courses/${courseId}`);
  return data;
};
const fetchDashboardData = async () => {
  const { data } = await apiClient.get('/dashboard/me');
  return data;
};

const CoursePlayerLayout = () => {
  const { courseId } = useParams();

  // Busca os dados do curso
  const { data: course, isLoading: courseLoading, isError: courseError } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId)
  });
  
  // Busca os dados de progresso do usuário logado
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboardMe'],
    queryFn: fetchDashboardData
  });

  // Cria um conjunto (Set) com os IDs de todas as aulas concluídas pelo usuário para busca rápida
  const completedLessonIds = new Set(
    dashboardData?.enrolledCourses
      .flatMap(enrollment => enrollment.Course?.modules || [])
      .flatMap(module => module.lessons || [])
      .map(lesson => lesson.LessonProgress?.lessonId)
      .filter(id => id) // Filtra IDs undefined
  );
  
  // Aprimorado para lidar com múltiplos status de carregamento
  if (courseLoading) return <div className="player-loading">Carregando curso...</div>;
  if (courseError) return <div className="player-loading">Curso não encontrado.</div>;

  return (
    <div className="course-player-layout">
      <aside className="course-curriculum-sidebar">
        <h3 className="course-title">{course.title}</h3>
        {course.modules?.map(module => (
          <div key={module.id} className="module-section">
            <h4 className="module-title">{module.title}</h4>
            <ul className="lessons-list">
              {module.lessons?.map(lesson => {
                // Verifica se a aula atual está na lista de aulas concluídas
                const isCompleted = completedLessonIds.has(lesson.id);
                
                return (
                  <li key={lesson.id}>
                    <NavLink
                      to={`/cursos/${courseId}/aula/${lesson.id}`}
                      className={({ isActive }) => 
                        `lesson-link ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`
                      }
                    >
                      {/* Ícone muda com base no status de conclusão */}
                      <span className="progress-icon">
                        {isCompleted ? <FaRegCheckCircle /> : <FaCheckCircle />}
                      </span>
                      {lesson.title}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>
      <main className="lesson-content-area">
        <Outlet context={{ course, dashboardData }} /> {/* Passa ambos os dados para a LessonPage */}
      </main>
    </div>
  );
};

export default CoursePlayerLayout;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/axiosConfig';
import './CourseEditorPage.css'; // Criaremos a seguir
import ModuleList from '../../components/admin/courses/ModuleList';
import AddModuleModal from '../../components/admin/courses/AddModuleModal';
import AddLessonModal from '../../components/admin/courses/AddLessonModal';

// ... (Aqui virão os componentes ModuleList, etc.)

  const fetchCourseById = async (courseId) => {
    const { data } = await apiClient.get(`/courses/${courseId}`);
    return data;
  };

const CourseEditorPage = () => {
  const { courseId } = useParams();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const [currentModuleId, setCurrentModuleId] = useState(null);

   const handleAddLesson = (moduleId) => {
    setCurrentModuleId(moduleId); // Guarda o ID do módulo
    setIsLessonModalOpen(true); // Abre o modal de aula
  };

    const { data: course, isLoading, isError } = useQuery({
    queryKey: ['adminCourse', courseId],
    // Passamos uma função anônima que chama fetchCourseById com o parâmetro correto.
    queryFn: () => fetchCourseById(courseId), 
  });
  


  if (isLoading) return <p>Carregando editor de curso...</p>;
  if (isError) return <p>Erro ao carregar o curso.</p>;

  return (
    <div className="course-editor-page">
      <header className="course-editor-header">
        <div>
          <Link to="/admin/courses" className="back-link">← Voltar para Cursos</Link>
          <h1 className="course-editor-title">Editando: {course.title}</h1>
        </div>
        <button className="btn-save-course">Salvar Alterações</button>
      </header>

      <div className="course-editor-layout">
        <div className="course-modules-container">
          <h2>Módulos e Aulas</h2>
          {/* Aqui entrará o componente para gerenciar os módulos e aulas */}
            <ModuleList 
            course={course} 
            onAddModule={() => setIsModalOpen(true)}
            onAddLesson={handleAddLesson} 
          />
        </div>
        <aside className="course-details-sidebar">
          <h2>Detalhes do Curso</h2>
          {/* Aqui entrará o formulário para editar título, categoria, etc. */}
          <p>Em breve: formulário de detalhes.</p>
        </aside>
      </div>
       {isModalOpen && (
        <AddModuleModal 
          courseId={course.id} 
          onclose={() => setIsModalOpen(false)}
          moduleCount={course.modules?.length || 0}
        />
      )}
       {isLessonModalOpen && (
        <AddLessonModal 
          courseId={course.id}
          moduleId={currentModuleId}
          onclose={() => setIsLessonModalOpen(false)}
          // Passa a contagem de aulas do módulo específico
          lessonCount={course.modules.find(m => m.id === currentModuleId)?.lessons.length || 0}
        />
      )}
    </div>
  );
};

export default CourseEditorPage;
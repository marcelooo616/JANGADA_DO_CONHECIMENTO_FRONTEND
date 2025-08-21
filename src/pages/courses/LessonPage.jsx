import React from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import LexicalRenderer from '../../components/LexicalRenderer'; 
import './LessonPage.css';

const markLessonAsComplete = (lessonId) => {
  return apiClient.post(`/lessons/${lessonId}/complete`);
};

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const { course } = useOutletContext(); // Recebe os dados do curso do layout pai
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Encontra a aula atual e a próxima aula
  let currentLesson = null;
  let nextLessonId = null;
  course.modules.forEach(module => {
    module.lessons.forEach((lesson, index) => {
      if (lesson.id === parseInt(lessonId)) {
        currentLesson = lesson;
        // Verifica se há uma próxima aula no mesmo módulo
        if (index < module.lessons.length - 1) {
          nextLessonId = module.lessons[index + 1].id;
        }
      }
    });
  });


  const completeMutation = useMutation({
    mutationFn: markLessonAsComplete,
    onSuccess: (data) => {
      toast.success(`Aula concluída! +${data.data.xpGained || 0} XP!`);
      // Invalida os dados do dashboard para atualizar o progresso e XP
      queryClient.invalidateQueries({ queryKey: ['dashboardMe'] });
      // Invalida os dados do curso para atualizar o status de conclusão das aulas (futuro)
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });

      // Se houver uma próxima aula, navega para ela
      if (nextLessonId) {
        navigate(`/cursos/${courseId}/aula/${nextLessonId}`);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Ocorreu um erro.');
    }
  });

  if (!currentLesson) {
    return <div>Aula não encontrada.</div>;
  }

  return (
    <div className="lesson-page">
      <h1 className="lesson-title">{currentLesson.title}</h1>
      
      {/* Aqui você pode adicionar a renderização do vídeo, se houver */}
      {/* {currentLesson.video_url && <iframe ... />} */}

      <div className="lesson-content">
        <LexicalRenderer jsonContent={currentLesson.content} />
      </div>

      <div className="lesson-actions">
        <button 
          className="complete-lesson-btn"
          onClick={() => completeMutation.mutate(currentLesson.id)}
          disabled={completeMutation.isPending}
        >
          {completeMutation.isPending ? 'Processando...' : 'Marcar como Concluída'}
        </button>
      </div>
    </div>
  );
};

export default LessonPage;
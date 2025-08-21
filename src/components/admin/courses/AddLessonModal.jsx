import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const addLessonToModule = async ({ moduleId, title, order, xp_value }) => {
  // Usamos a rota que já criamos no back-end
  const { data } = await apiClient.post(`/courses/modules/${moduleId}/lessons`, { title, order, xp_value });
  return data;
};

const AddLessonModal = ({ courseId, moduleId, onclose, lessonCount }) => {
  const [title, setTitle] = useState('');
  const [xpValue, setXpValue] = useState(100); // Valor padrão de XP
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addLessonToModule,
    onSuccess: () => {
      toast.success("Aula adicionada com sucesso!");
      // Invalida a query do curso específico para recarregar a lista de aulas
      queryClient.invalidateQueries({ queryKey: ['adminCourse', courseId] });
      onclose();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Erro ao adicionar aula.')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ 
      moduleId, 
      title, 
      order: lessonCount + 1,
      xp_value: xpValue 
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h3>Nova Aula</h3>
          <div className="form-group">
            <label htmlFor="lesson-title">Título da Aula</label>
            <input
              id="lesson-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: O que é IaaS, PaaS e SaaS?"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lesson-xp">Pontos de Experiência (XP)</label>
            <input
              id="lesson-xp"
              type="number"
              value={xpValue}
              onChange={(e) => setXpValue(parseInt(e.target.value, 10))}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onclose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-save" disabled={mutation.isPending}>
              {mutation.isPending ? 'Criando...' : 'Criar Aula'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonModal;
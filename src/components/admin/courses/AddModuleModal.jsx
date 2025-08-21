import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const addModuleToCourse = async ({ courseId, title, order }) => {
  const { data } = await apiClient.post(`/courses/${courseId}/modules`, { title, order });
  return data;
};

const AddModuleModal = ({ courseId, onclose, moduleCount }) => {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addModuleToCourse,
    onSuccess: () => {
      toast.success("Módulo adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['adminCourse', courseId] });
      onclose();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Erro ao adicionar módulo.')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ courseId, title, order: moduleCount + 1 });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h3>Novo Módulo</h3>
          <div className="form-group">
            <label htmlFor="module-title">Título do Módulo</label>
            <input
              id="module-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Introdução ao Power BI"
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onclose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-save" disabled={mutation.isPending}>
              {mutation.isPending ? 'Criando...' : 'Criar Módulo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModuleModal;
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import './AdminCoursesPage.css'; // Criaremos a seguir

// API Functions
const fetchAdminCourses = async () => {
  // O token de admin já é enviado pelo interceptor do apiClient
  const { data } = await apiClient.get('/courses'); 
  return data.courses; // A API retorna um objeto paginado, pegamos a lista
};

const createDraftCourse = async () => {
  // A API para criar curso já está pronta no back-end
  const { data } = await apiClient.post('/courses', {
    title: "Novo Rascunho de Curso",
    status: "draft",
    categoryId: 1 // Usando uma categoria padrão, ex: 'Geral'
  });
  return data;
};

const AdminCoursesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({ 
    queryKey: ['adminCourses'], 
    queryFn: fetchAdminCourses 
  });

  const createCourseMutation = useMutation({
    mutationFn: createDraftCourse,
    onSuccess: (newCourse) => {
      toast.success("Rascunho de curso criado! Redirecionando para o editor...");
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
      // Redireciona o admin para a página de edição do novo curso
      navigate(`/admin/cursos/${newCourse.id}/editar`);
    },
    onError: (error) => toast.error("Erro ao criar rascunho de curso.")
  });

  const handleCreateCourse = () => {
    createCourseMutation.mutate();
  };

  return (
    <div className="admin-page-container">
      <div className="section-header">
        <h2 className="section-title">Gerenciar Cursos</h2>
        <button 
          onClick={handleCreateCourse} 
          className="add-new-btn"
          disabled={createCourseMutation.isPending}
        >
          {createCourseMutation.isPending ? 'Criando...' : <><i className="fas fa-plus"></i> Criar Novo Curso</>}
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{width: '40%'}}>Título do Curso</th>
              <th style={{width: '20%'}}>Categoria</th>
              <th style={{width: '20%'}}>Status</th>
              <th style={{width: '20%'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan="4">Carregando cursos...</td></tr>}
            {courses?.map(course => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.Category?.name || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${course.status === 'published' ? 'status-active' : 'status-inactive'}`}>
                    {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="actions-cell">
                  <Link to={`/admin/cursos/${course.id}/editar`} className="action-btn edit-btn" title="Editar Curso">
                    <i className="fas fa-pencil-alt"></i> Editar
                  </Link>
                  {/* Botão de deletar pode ser adicionado aqui no futuro */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoursesPage;
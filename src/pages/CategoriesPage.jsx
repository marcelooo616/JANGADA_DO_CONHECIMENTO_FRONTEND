import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './CategoriesPage.css';

// --- Funções de API ---
const API_URL = 'http://137.131.212.103:3000/api';

const fetchCategories = async () => {
  const { data } = await axios.get(`${API_URL}/categories`);
  return data;
};

// Validação: Verifica se a categoria tem artigos
const checkCategoryHasArticles = async (categoryId) => {
  // IMPORTANTE: Você precisará criar esta rota no seu backend
  const { data } = await axios.get(`${API_URL}/categories/${categoryId}/article-count`);
  return data; // Espera-se um retorno como { count: 3 }
};

const createCategory = ({ token, name }) => {
  return axios.post(`${API_URL}/categories`, { name }, { headers: { Authorization: `Bearer ${token}` } });
};

const updateCategory = ({ token, id, name }) => {
  return axios.put(`${API_URL}/categories/${id}`, { name }, { headers: { Authorization: `Bearer ${token}` } });
};

const deleteCategory = ({ token, id }) => {
  return axios.delete(`${API_URL}/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};


// --- Componente Principal ---
export default function CategoriesPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Estados para controlar o modal
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // Se for null, é "criar"; se tiver um objeto, é "editar"
  const [categoryName, setCategoryName] = useState('');

   // --- NOVO ESTADO PARA O MODAL DE CONFIRMAÇÃO ---
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Busca de dados
  const { data: categories, isLoading, isError } = useQuery({ 
    queryKey: ['categories'], 
    queryFn: fetchCategories 
  });

  // Mutações (ações de escrita)
  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Ocorreu um erro.'),
  };

  const createMutation = useMutation({ mutationFn: createCategory, ...mutationOptions, onSuccess: () => { toast.success("Categoria criada!"); mutationOptions.onSuccess(); }});
  const updateMutation = useMutation({ mutationFn: updateCategory, ...mutationOptions, onSuccess: () => { toast.success("Categoria atualizada!"); mutationOptions.onSuccess(); }});
  const deleteMutation = useMutation({ mutationFn: deleteCategory, ...mutationOptions, onSuccess: () => { toast.success("Categoria deletada!"); mutationOptions.onSuccess(); }});

  // Funções de controle do modal
  const openCreateModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setCategoryName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName) return toast.error("O nome da categoria é obrigatório.");

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, name: categoryName, token });
    } else {
      createMutation.mutate({ name: categoryName, token });
    }
  };

   const handleDelete = async (category) => {
    try {
      const { count } = await checkCategoryHasArticles(category.id);
      
      if (count > 0) {
        toast.error(`Não é possível deletar "${category.name}". Existem ${count} artigos associados.`);
        return;
      }
      
      // Se a validação passar, em vez de 'window.confirm', nós abrimos nosso modal
      setCategoryToDelete(category);
      setShowDeleteConfirm(true);

    } catch (error) {
      toast.error("Erro ao validar a categoria. Tente novamente.");
    }
  };

   const confirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate({ id: categoryToDelete.id, token });
    }
    // Fecha o modal de confirmação
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="admin-page-container">
      <div className="section-header">
        <h2 className="section-title">Gerenciar Categorias</h2>
        <button onClick={openCreateModal} className="add-new-btn">
          <i className="fas fa-plus"></i> Nova Categoria
        </button>
      </div>

      {isLoading && <p>Carregando categorias...</p>}
      {isError && <p>Erro ao carregar categorias.</p>}

      <div className="table-container">
        <table className="categories-table">
          <thead>
            <tr>
              <th>Nome da Categoria</th>
              <th>Slug</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td className="actions-cell">
                  <button onClick={() => openEditModal(category)} className="action-btn edit-btn">
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                  <button onClick={() => handleDelete(category)} className="action-btn delete-btn">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Criar/Editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <h3>{editingCategory ? 'Editar' : 'Nova'} Categoria</h3>
              <div className="form-group">
                <label htmlFor="category-name">Nome da Categoria</label>
                <input
                  id="category-name"
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Ex: Software"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-save" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
       {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <h3>Confirmar Exclusão</h3>
            <p>
              Você tem certeza que deseja deletar a categoria 
              <strong> "{categoryToDelete?.name}"</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </p>
            <div className="modal-actions">
              <button 
                type="button" 
                onClick={() => setShowDeleteConfirm(false)} 
                className="btn-cancel"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={confirmDelete} 
                className="btn-delete-confirm" 
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deletando...' : 'Sim, Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
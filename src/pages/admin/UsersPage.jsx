import React, { useState, useEffect } from 'react'; 
import apiClient from '../../api/axiosConfig'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './UsersPage.css';
import CustomSelect from '../../components/CustomSelect';


const fetchUsers = async (token) => {
  const { data } = await apiClient.get(`/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

const fetchRoles = async (token) => {
  const { data } = await apiClient.get(`/roles`, { // IMPORTANTE: Você precisará criar esta rota
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};


const updateUser = ({ token, id, payload }) => {
  return apiClient.put(`/users/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// --- Componente Principal ---
export default function UsersPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');

  // Busca de dados
  const { data: users, isLoading, isError } = useQuery({ 
    queryKey: ['users'], 
    queryFn: () => fetchUsers(token),
    enabled: !!token, // Só busca se o token existir
  });

   const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => fetchRoles(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 10, // 10 minutos em milissegundos
  });

  // Mutação para atualizar o usuário (ativar/desativar ou mudar role)
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Erro ao atualizar usuário.'),
  });

   const openEditModal = (user) => {
    setEditingUser(user);
    setSelectedRoleId(user.Role ? user.Role.id : '');  // Pré-seleciona a role atual do usuário
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setSelectedRoleId('');
  };

  const handleRoleSubmit = (e) => {
    e.preventDefault();
    if (!editingUser || !selectedRoleId) return;

    const payload = {
      roleId: selectedRoleId,
      IS_ACTIVE: editingUser.IS_ACTIVE, // Mantém o status atual
    };
    updateMutation.mutate({ id: editingUser.id, payload, token });
    closeEditModal();
  };

  // Função para ativar/desativar
  const handleToggleActive = (user) => {
    const payload = {
       IS_ACTIVE: user.IS_ACTIVE ? 0 : 1, // Inverte o status atual
      roleId: user.Role.id,       // Mantém a role atual
    };
    updateMutation.mutate({ id: user.id, payload, token });
  };


  if (isLoading) return <p className="loading-message">Carregando usuários...</p>;
  if (isError) return <p className="error-message">Erro ao carregar usuários.</p>;

  return (
    <div className="admin-page-container">
      <div className="section-header">
        <h2 className="section-title">Gerenciar Usuários</h2>
        <p className="section-subtitle">Ative, desative e gerencie as permissões dos usuários da plataforma.</p>
      </div>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nome Completo</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.Role?.name || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${user.IS_ACTIVE ? 'status-active' : 'status-inactive'}`}>
                    {user.IS_ACTIVE ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="actions-cell">
                  {/* Botão de Editar (funcionalidade futura, abre um modal) */}
                  <button onClick={() => openEditModal(user)} className="action-btn edit-btn" title="Editar Role">
                    <i className="fas fa-pencil-alt"></i>
                  </button>

                  {/* Botão Dinâmico de Ativar/Desativar */}
                  <button 
                    onClick={() => handleToggleActive(user)}
                    className={`action-btn toggle-active-btn ${user.IS_ACTIVE ? 'toggle-active-btn--deactivate' : 'toggle-active-btn--activate'}`}
                    title={user.IS_ACTIVE ? 'Desativar usuário' : 'Ativar usuário'}
                    disabled={updateMutation.isPending}
                  >
                    <i className={`fas ${user.IS_ACTIVE ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i>
                    <span>{user.IS_ACTIVE ? 'Desativar' : 'Ativar'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content edit-role-modal">
            <form onSubmit={handleRoleSubmit}>
              <h3>Editar Cargo de Usuário</h3>
              <p>
                Alterando o cargo para: <strong>{editingUser?.full_name}</strong>
              </p>
              <div className="form-group">
                <label htmlFor="role-select">Cargo (Role)</label>
                  <CustomSelect
                    options={roles || []}
                    value={selectedRoleId}
                    onChange={(value) => setSelectedRoleId(value)}
                    placeholder="Selecione um cargo"
            />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeEditModal} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-save" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
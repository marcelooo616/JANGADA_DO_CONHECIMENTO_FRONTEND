// src/pages/admin/AdminDashboardPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Para a mensagem personalizada
import './AdminDashboardPage.css'; // Estilo da página

const AdminDashboardPage = () => {
  const { user } = useAuth();

  // No futuro, estes dados podem vir de uma API
  const stats = {
    articles: 128,
    categories: 12,
    users: 34,
  };

  return (
    <div className="admin-dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Bem-vindo, {user?.name || 'Admin'}!</h1>
        <p className="dashboard-subtitle">
          Este é o painel de controle da Jangada do Conhecimento. Utilize a navegação ao lado ou os atalhos abaixo para gerenciar o conteúdo.
        </p>
      </header>

      {/* Seção de Estatísticas Rápidas (opcional, mas interessante) */}
      <div className="stat-cards-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.articles}</span>
          <span className="stat-label">Artigos Publicados</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.categories}</span>
          <span className="stat-label">Categorias Criadas</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.users}</span>
          <span className="stat-label">Usuários Registrados</span>
        </div>
      </div>

      {/* Seção de Ações Rápidas */}
      <div className="action-cards-grid">
        <Link to="/admin/categories" className="action-card">
          <div className="action-card-icon"><i className="fas fa-tags"></i></div>
          <h3 className="action-card-title">Gerenciar Categorias</h3>
          <p className="action-card-desc">Crie, edite e delete as categorias dos artigos.</p>
        </Link>
        
        <Link to="/admin/users" className="action-card">
          <div className="action-card-icon"><i className="fas fa-users-cog"></i></div>
          <h3 className="action-card-title">Gerenciar Usuários</h3>
          <p className="action-card-desc">Visualize e administre os usuários da plataforma.</p>
        </Link>
        
        <Link to="/admin/artigo/novo" className="action-card">
          <div className="action-card-icon"><i className="fas fa-plus-circle"></i></div>
          <h3 className="action-card-title">Criar Novo Artigo</h3>
          <p className="action-card-desc">Comece a escrever um novo conteúdo para a base de conhecimento.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
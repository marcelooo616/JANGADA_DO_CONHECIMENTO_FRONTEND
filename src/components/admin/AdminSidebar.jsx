// src/components/admin/AdminSidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css'; // Estilo da sidebar

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h4>Painel Admin</h4>
      </div>
      <nav className="sidebar-nav">
        {/* Adicione mais links aqui no futuro */}
        <NavLink to="/admin/categories" className="sidebar-link">
          <i className="fas fa-tags"></i>
          <span>Categorias</span>
        </NavLink>
        <NavLink to="/admin/users" className="sidebar-link">
          <i className="fas fa-users"></i>
          <span>Usuários</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
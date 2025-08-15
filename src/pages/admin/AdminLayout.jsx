// src/pages/admin/AdminLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar'; // Criaremos a seguir
import './AdminLayout.css'; // Estilo para o layout

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <Outlet /> {/* <<-- As páginas filhas (Categorias, Usuários) serão renderizadas aqui */}
      </main>
    </div>
  );
};

export default AdminLayout;
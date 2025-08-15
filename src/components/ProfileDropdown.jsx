// src/components/ProfileDropdown.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser } from 'react-icons/fi';
import './ProfileDropdown.css'; // Vamos criar este CSS

function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null; // Não mostra nada se não estiver logado

  return (
    <div className="profile-dropdown">
      <button onClick={() => setIsOpen(!isOpen)} className="profile-btn">
        <FiUser size={24} />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setIsOpen(false)}>Painel Admin</Link>
          )}
          <a href="/" onClick={logout}>Sair</a>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
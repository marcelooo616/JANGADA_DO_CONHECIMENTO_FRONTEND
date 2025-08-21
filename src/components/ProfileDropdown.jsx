// src/components/ProfileDropdown.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser } from 'react-icons/fi';
import './ProfileDropdown.css'; // Vamos criar este CSS

function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

   useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  if (!user) return null; // Não mostra nada se não estiver logado

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };


  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="profile-btn">
        <FiUser size={24} />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setIsOpen(false)}>Painel Admin</Link>
          )}
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>Meu Painel</Link>
          <a href="/" onClick={logout}>Sair</a>
          
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
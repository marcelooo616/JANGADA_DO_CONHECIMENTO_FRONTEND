// src/components/Navbar.jsx

import { useState } from 'react'; // 1. Importa o useState
import { NavLink, Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import './Navbar.css';

function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 2. Estado para controlar o menu

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Jangada do Conhecimento</Link>
          </div>
          {/* Este menu só aparece em telas grandes */}
          <div className="navbar-main-links">
            <NavLink to="/knowledge">Knowledge</NavLink>
            <NavLink to="/cursos">Cursos</NavLink>
          </div>
        </div>

        {/* Este menu só aparece em telas grandes */}
        <div className="navbar-right">
          {user?.role === 'admin' && (
            <NavLink to="/admin/artigo/novo" className="btn-new-article">Novo Artigo</NavLink>
          )}
          {user ? (
            <ProfileDropdown />
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="btn-register">Cadastro</NavLink>
            </>
          )}
        </div>

        {/* 3. Botão Hambúrguer (só aparece em telas pequenas) */}
        <button 
          className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* 4. Menu Mobile Dropdown (só aparece quando clicamos no hambúrguer) */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <NavLink to="/knowledge" onClick={() => setIsMenuOpen(false)}>Knowledge</NavLink>
          <NavLink to="/cursos" onClick={() => setIsMenuOpen(false)}>Cursos</NavLink>
          <hr className="mobile-menu-divider" />
          {user?.role === 'admin' && (
            <NavLink to="/admin/artigo/novo" onClick={() => setIsMenuOpen(false)}>Novo Artigo</NavLink>
          )}
          {user ? (
            <div className="mobile-profile-section">
              <ProfileDropdown />
            </div>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" onClick={() => setIsMenuOpen(false)}>Cadastro</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
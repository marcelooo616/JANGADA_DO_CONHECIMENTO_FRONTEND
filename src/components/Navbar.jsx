// src/components/Navbar.jsx

// IMPORTANTE: Troque 'Link' por 'NavLink' para os links de navegação
import { NavLink, Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import './Navbar.css';


function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Lado Esquerdo: Logo e Navegação Principal */}
        <div className="navbar-left">
          <div className="navbar-logo">
            <Link to="/">Jangada do Conhecimento</Link>
          </div>
          <div className="navbar-main-links">
            {/* Adicionando os novos links com NavLink */}
            <NavLink to="/knowledge">Knowledge</NavLink>
           
              {user?.role === 'admin' && (
            <NavLink to="/cursos">Cursos</NavLink>
          )}
            
          </div>
        </div>

        {/* Lado Direito: Ações e Perfil do Usuário */}
        <div className="navbar-right">
          {user?.role === 'admin' && (
            <NavLink to="/admin/artigo/novo" className="btn-new-article">Novo Artigo</NavLink>
          )}
          {user ? (
            <>
              {/* <span className="welcome-message">Bem-vindo, {user.name}!</span> */}
              <ProfileDropdown />
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="btn-register">Cadastro</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
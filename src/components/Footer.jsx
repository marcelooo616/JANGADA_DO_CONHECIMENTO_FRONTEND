// src/components/Footer.jsx

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Coluna 1: Plataforma */}
          <div className="footer-column">
            <h4 className="footer-column-title">Plataforma</h4>
            <ul>
              <li><a href="/cursos">Cursos</a></li>
              <li><a href="/trilhas">Trilhas de Aprendizagem</a></li>
              <li><a href="/artigos">Diário de Bordo</a></li>
            </ul>
          </div>

          {/* Coluna 2: Comunidade */}
          <div className="footer-column">
            <h4 className="footer-column-title">Comunidade</h4>
            <ul>
              <li><a href="/sobre">Sobre Nós</a></li>
              <li><a href="/contato">Contato</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>

          {/* Coluna 3: Legal */}
          <div className="footer-column">
            <h4 className="footer-column-title">Legal</h4>
            <ul>
              <li><a href="/termos">Termos de Serviço</a></li>
              <li><a href="/privacidade">Política de Privacidade</a></li>
            </ul>
          </div>

          {/* Coluna 4: Logo/Nome */}
          <div className="footer-column">
             <h4 className="footer-column-title">Jangada do Conhecimento</h4>
             <p className="footer-tagline">Sua embarcação para o futuro.</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Jangada do Conhecimento. Todos os direitos reservados.
          </p>
          <div className="footer-socials">
            {/* Adicione links para suas redes sociais */}
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
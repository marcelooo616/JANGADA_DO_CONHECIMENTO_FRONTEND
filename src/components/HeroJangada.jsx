// src/components/HeroJangada.jsx

import React from 'react';
import './HeroJangada.css';
import { Link } from 'react-router-dom';
// Importe as imagens dos logos
import windowsLogo from '../assets/windows-logo.png';
import officeLogo from '../assets/office-logo.png';
import azureLogo from '../assets/azure-logo.png';
// Adicione mais importações conforme necessário

const HeroJangada = () => {
  return (
    <section className="hero-container">
      {/* Logos de fundo */}
      <img src={windowsLogo} alt="Windows Logo" className="background-logo windows-logo" />
      <img src={officeLogo} alt="Office Logo" className="background-logo office-logo" />
      
      {/* Adicione mais logos conforme necessário */}

      <div className="hero-content">
        <h1 className="hero-title">
          Navegue por um oceano de conhecimento.
        </h1>
        <p className="hero-subtitle">
          Da teoria à prática, a <strong>Jangada do Conhecimento</strong> é sua embarcação para dominar novas habilidades e explorar futuros possíveis.
        </p>
        <div className="hero-cta-buttons">
          <Link to="/knowledge" className="cta-primary">Explorar Artigos</Link>
          <button className="cta-secondary">Conheça a Plataforma</button>
        </div>
        <div className="hero-extra-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7.765 1.559a.5.5 0 0 1 .47 0l6 3a.5.5 0 0 1 0 .882l-6 3a.5.5 0 0 1-.47 0l-6-3a.5.5 0 0 1 0-.882l6-3z"/>
            <path d="m2.125 8.567-1.8-1.799a.5.5 0 0 1 .445-.882l6.3 3.149a.5.5 0 0 1 0 .883l-6.3 3.149a.5.5 0 0 1-.445-.882l1.8-1.799V8.567zM13.875 6.768l1.8 1.799a.5.5 0 0 1-.445.882l-6.3-3.149a.5.5 0 0 1 0-.883l6.3-3.149a.5.5 0 0 1 .445.882l-1.8 1.799v1.798z"/>
          </svg>
          <span>Mais de 100 artigos disponíveis para sua tripulação.</span>
        </div>
      </div>
    </section>
  );
};

export default HeroJangada;
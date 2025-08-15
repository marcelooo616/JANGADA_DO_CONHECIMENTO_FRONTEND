 // src/components/CertificationBanner.jsx

import React from 'react';
import './CertificationBanner.css';

// Defina a sua trilha de certificação aqui.
// É fácil adicionar ou remover certificações apenas editando este array.

import ms900Logo from '../assets/ms900.png';
import md102Logo from '../assets/md102.webp';
import ms102Logo from '../assets/az305.png';

const certificationPath = [
  { id: 1, name: 'MS-900', description: 'M365 Fundamentals', logoSrc: ms900Logo },
  { id: 2, name: 'MD-102', description: 'Endpoint Administrator', logoSrc: md102Logo },
  { id: 3, name: 'MS-102', description: 'M365 Administrator', logoSrc: ms102Logo },
  { id: 4, name: 'MS-102', description: 'M365 Administrator', logoSrc: ms102Logo },
  { id: 5, name: 'MS-102', description: 'M365 Administrator', logoSrc: ms102Logo },
];

const CertificationBanner = () => {
  return (
    <section className="cert-banner">
      <div className="cert-banner-content">
        <h2 className="cert-banner-title">Inicie sua Jornada de Certificação Microsoft Azure</h2>
        <p className="cert-banner-subtitle">
          Siga a trilha completa, do fundamental ao especialista, e valide seu conhecimento com as certificações oficiais mais reconhecidas do mercado.
        </p>
        <button className="cert-banner-cta">Começar Trilha AZ-900</button>
      </div>

      <div className="certification-path">
        {certificationPath.map((cert, index) => (
          <React.Fragment key={cert.id}>
            <div className="path-step">
              <div className="cert-icon-container">
                <img src={cert.logoSrc} alt={`${cert.name} Logo`} className="cert-icon" />
              </div>
              <span className="cert-name">{cert.name}</span>
            </div>

            {/* Adiciona um conector entre os ícones, exceto após o último */}
            {index < certificationPath.length - 1 && (
              <div className="path-connector"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default CertificationBanner;
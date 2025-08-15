import React from 'react';
import './ArticleCard.css'; // Importa o arquivo de estilo

const ArticleCard = ({ article }) => {
    
  return (
    
    <div className="article-card">
      <div className="card-content">
        <h3 className="card-title">{article.title}</h3>
        <div className="card-meta">
          <span className="card-author">
            <i className="fas fa-user"></i> Autor: {article.User?.username || 'Anônimo'}
          </span>
          <span className="card-category">
            <i className="fas fa-tag"></i> Categoria: {article.Category?.name || 'Geral'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
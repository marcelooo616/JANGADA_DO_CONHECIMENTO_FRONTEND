// src/components/NewsGrid.jsx

import './NewsGrid.css';

function NewsGrid({ news }) {
  return (
    <section className="news-section">
      
      {/* Reutilizando o estilo do cabeçalho da seção */}
      <div className="section-header-center">
        <h2 className="section-title">Últimas Notícias da Microsoft</h2>
        <p className="section-subtitle">Fique por dentro das novidades do ecossistema que impulsiona o conhecimento.</p>
      </div>

      <div className="news-grid">
        {news.map((newsItem, index) => (
          <a href={newsItem.url} target="_blank" rel="noopener noreferrer" key={index} className="news-card">
            
            {newsItem.urlToImage && (
              <div className="news-card-image-container">
                <img src={newsItem.urlToImage} alt={newsItem.title} className="news-card-image" />
              </div>
            )}

            {/* Novo container para o conteúdo de texto */}
            <div className="news-card-content">
              <h3 className="news-card-title">{newsItem.title}</h3>
              <p className="news-card-description">{newsItem.description}</p>
            </div>

          </a>
        ))}
      </div>
    </section>
  );
}

export default NewsGrid;
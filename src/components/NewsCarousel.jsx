// src/components/NewsCarousel.jsx
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import NewsGrid from './NewsGrid';
import './NewsCarousel.css';

function NewsCarousel({ news, currentPage, totalPages, onPageChange }) {
  const effectiveTotalPages = Math.min(totalPages, 10);

  return (
    <section className="news-section">
     
      <div className="news-carousel-wrapper">
        
        {/* O botão agora é sempre renderizado, mas ganha a classe 'hidden' se necessário */}
        <button 
          className={`carousel-arrow ${currentPage <= 1 ? 'hidden' : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1} // Mantemos o disabled por boas práticas
        >
          <FiChevronLeft size={24} />
        </button>

        <div className="carousel-content">
          <NewsGrid news={news} />
        </div>

        {/* O mesmo para o botão da direita */}
        <button 
          className={`carousel-arrow ${currentPage >= effectiveTotalPages ? 'hidden' : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= effectiveTotalPages}
        >
          <FiChevronRight size={24} />
        </button>

      </div>
    </section>
  );
}

export default NewsCarousel;
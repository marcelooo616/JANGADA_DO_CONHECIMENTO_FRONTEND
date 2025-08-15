// src/components/Pagination.jsx
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Pagination.css';

const DOTS = '...';

// Função auxiliar para gerar o range de páginas a ser exibido
const generatePaginationRange = (currentPage, totalPages) => {
  if (totalPages <= 5) { // Se houver 5 páginas ou menos, mostra tudo
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, DOTS, totalPages];
  }

  if (currentPage > totalPages - 3) {
    return [1, DOTS, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, DOTS, currentPage - 1, currentPage, currentPage + 1, DOTS, totalPages];
};


function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const paginationRange = generatePaginationRange(currentPage, totalPages);

  return (
    <nav className="pagination-container">
      <button 
        className="pagination-item arrow"
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        <FiChevronLeft />
      </button>

      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return <span key={`${DOTS}-${index}`} className="pagination-item dots\">{DOTS}</span>;
        }

        return (
          <button 
            key={pageNumber} 
            onClick={() => onPageChange(pageNumber)}
            className={`pagination-item ${currentPage === pageNumber ? 'active' : ''}`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button 
        className="pagination-item arrow"
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        <FiChevronRight />
      </button>
    </nav>
  );
}

export default Pagination;
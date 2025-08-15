// src/components/Sidebar.jsx
import React from 'react';
import './Sidebar.css';

function Sidebar({ categories, selectedCategory, onCategorySelect }) {
  return (
    <aside className="knowledge-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Categorias</h3>
        <nav className="sidebar-nav">
          <a
            href="#"
            className={`sidebar-link ${selectedCategory === '' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onCategorySelect(''); // Limpa a seleção
            }}
          >
            Todos os Artigos
          </a>
          {categories.map(category => (
            <a
              href="#"
              key={category.id}
              className={`sidebar-link ${selectedCategory === category.id.toString() ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onCategorySelect(category.id.toString());
              }}
            >
              {category.name}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
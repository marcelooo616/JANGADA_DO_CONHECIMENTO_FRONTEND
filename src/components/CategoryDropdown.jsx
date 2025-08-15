import React, { useState, useEffect, useRef } from 'react';
import './CategoryDropdown.css';

const CategoryDropdown = ({ categories, selectedCategory, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Efeito para fechar a dropdown ao clicar fora dela
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSelect = (category) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  // Encontra o nome da categoria selecionada para exibição
  const selectedCategoryName = 
    categories.find(cat => (cat.id || cat) === selectedCategory)?.name || selectedCategory;

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <button className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedCategoryName}</span>
        <i className={`fas fa-chevron-down arrow-icon ${isOpen ? 'open' : ''}`}></i>
      </button>

      {isOpen && (
        <ul className="dropdown-options">
          {categories.map((cat) => (
            <li 
              key={cat.id || cat} 
              className={`dropdown-option ${selectedCategory === (cat.id || cat) ? 'selected' : ''}`}
              onClick={() => handleSelect(cat.id || cat)}
            >
              {cat.name || cat}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryDropdown;
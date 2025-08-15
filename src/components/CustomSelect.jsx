// src/components/CustomSelect.jsx
import { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './CustomSelect.css';

function CustomSelect({ options, value, onChange, placeholder = 'Selecione' }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find(option => option.id === value);
  const displayValue = selectedOption ? selectedOption.name : placeholder;

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Efeito para fechar o dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-select-container" ref={selectRef}>
      <button type="button" className="custom-select-value" onClick={() => setIsOpen(!isOpen)}>
        <span>{displayValue}</span>
        <FiChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && (
        <ul className="custom-select-options">
          {options.map(option => (
            <li 
              key={option.id} 
              className={`option ${option.id === value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.id)}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
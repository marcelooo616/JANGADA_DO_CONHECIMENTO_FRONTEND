// src/components/ThemeToggle.jsx
import { useAuth } from '../context/AuthContext';
import { FiSun, FiMoon } from 'react-icons/fi'; 
import './ThemeToggle.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useAuth(); // Pega tudo do contexto

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme} title="Mudar tema">
      {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
    </button>
  );
}

export default ThemeToggle;
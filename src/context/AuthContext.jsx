// src/context/AuthContext.jsx

import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Cria o Contexto
const AuthContext = createContext();

// 2. Cria o Provedor do Contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
   const [isLoading, setIsLoading] = useState(true);
   
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };
  // Este efeito roda quando a aplicação carrega
  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        // Se o token for inválido, limpa
        localStorage.removeItem('token');
        setToken(null);
      }
    }
  }, [token]);

  // Função de login que será usada pela LoginPage
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const authContextValue = {
    user,
    token,
    login,
    logout,
    theme, // <<-- Exportamos o tema atual
    toggleTheme, // <<-- Exportamos a função de troca
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Cria um hook customizado para facilitar o uso do contexto
export function useAuth() {
  return useContext(AuthContext);
}
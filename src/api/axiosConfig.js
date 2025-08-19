// src/api/axiosConfig.js
import axios from 'axios';

// Cria uma instância do axios com a configuração base
///baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
const apiClient = axios.create({
  // 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
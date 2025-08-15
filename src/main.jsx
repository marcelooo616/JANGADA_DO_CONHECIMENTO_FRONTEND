// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'prismjs/themes/prism-tomorrow.css'; // Um tema escuro popular. Outras opções: prism.css, prism-okaidia.css, etc.
import './index.css'
import { AuthProvider } from './context/AuthContext';
// 1. Importa as ferramentas necessárias
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 2. Cria uma instância do cliente
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Envolve a aplicação com o QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
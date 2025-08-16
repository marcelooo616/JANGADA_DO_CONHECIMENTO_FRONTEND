// src/pages/RegisterPage.jsx

import { useState } from 'react';
import apiClient from '../api/axiosConfig'; 
import { Link, useNavigate } from 'react-router-dom'; // Importa o useNavigate



import './AuthForm.css';

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para navegar programaticamente

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await apiClient.post(`/auth/register`, {
        full_name: fullName,
        username,
        email,
        password,
      });
      setMessage('Cadastro realizado com sucesso! Redirecionando para o login...');
      
      // Aguarda 2 segundos e redireciona o usuário para a página de login
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.response.data.message || 'Ocorreu um erro no cadastro.');
    }
  };

  return (
     <div className="auth-container">
      <div className="auth-form-card">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Cadastro</h2>
          <div className="auth-form-group">
            <label htmlFor="fullName">Nome Completo:</label>
            <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="auth-form-group">
            <label htmlFor="username">Nome de Usuário:</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="auth-form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="auth-form-group">
            <label htmlFor="password">Senha:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-button">Cadastrar</button>
        </form>
        {message && <div className="result-success"><p>{message}</p></div>}
        {error && <div className="result-error"><p>{error}</p></div>}
        <p className="auth-switch-link">
          Já tem uma conta? <Link to="/login">Faça o login aqui</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
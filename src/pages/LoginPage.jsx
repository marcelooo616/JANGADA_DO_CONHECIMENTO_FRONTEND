// src/pages/LoginPage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const API_URL = 'http://137.131.212.103:3000/api';

import './AuthForm.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Renomeamos para 'isSubmitting' para ser mais claro sobre sua função (feedback do botão)
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // 'isLoading' do contexto nos diz se a verificação inicial do usuário já terminou
  const { login, user, isLoading } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!isLoading && user) {
      toast.info('Você já está logado!');
      navigate('/');
    }else{
       try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      login(response.data.token);
      toast.success('Login realizado com sucesso!');
      navigate('/');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Ocorreu um erro ao fazer login.');
    } finally {
      setIsSubmitting(false);
    }
    }
  };

  return (
     <div className="auth-container">
      <div className="auth-form-card">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="auth-form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-switch-link">
          Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
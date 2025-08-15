// src/components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 1. Enquanto o contexto verifica o usuário, mostra uma mensagem de espera
  if (isLoading) {
    return <div>Verificando permissões...</div>;
  }

  // 2. Se a verificação terminou e o usuário não é admin, redireciona
  if (user?.role !== 'admin') {
    // Redireciona para a home, guardando a página que ele tentou acessar
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. Se for admin, mostra o conteúdo da rota
  return children;
}

export default ProtectedRoute;
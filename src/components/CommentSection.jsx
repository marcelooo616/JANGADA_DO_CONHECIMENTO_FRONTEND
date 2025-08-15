// src/components/CommentSection.jsx

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import './CommentSection.css';

const API_URL = 'http://137.131.212.103:3000/api';

// A função que envia o novo comentário para a API
const postComment = ({ token, articleId, content }) => {
  return axios.post(
    `${API_URL}/comments`,
    { articleId, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

function CommentSection({ articleId, comments }) {
  const { user, token } = useAuth();
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  // useMutation é a ferramenta do TanStack Query para criar/atualizar/deletar dados
  const mutation = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      // Quando o comentário é postado com sucesso:
      toast.success('Comentário adicionado!');
      setNewComment(''); // Limpa o campo de texto
      // Invalida a query de comentários para forçar o TanStack Query a buscar a lista atualizada
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao postar comentário.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    mutation.mutate({ token, articleId, content: newComment });
  };

  return (
    <div className="comment-section">
      <h3>Comentários ({comments.length})</h3>
      
      {/* Formulário para adicionar um novo comentário (só aparece se o usuário estiver logado) */}
      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva seu comentário..."
            rows="3"
            disabled={mutation.isPending}
          />
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Enviando...' : 'Enviar Comentário'}
          </button>
        </form>
      )}

      {/* Lista de comentários */}
      <div className="comment-list">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <p className="comment-author">{comment.User?.username || 'Usuário'}</p>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))
        ) : (
          <p>Seja o primeiro a comentar!</p>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
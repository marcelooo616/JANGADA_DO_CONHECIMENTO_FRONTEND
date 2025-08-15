// src/pages/ArticlePage.jsx

import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import CommentSection from './CommentSection';
import LexicalRenderer from './LexicalRenderer';
import './ArticlePage.css';

const API_URL = 'https://137.131.212.103/api';

// Funções de busca de dados para o TanStack Query
const fetchArticleBySlug = async (slug) => {
  const { data } = await axios.get(`${API_URL}/articles/${slug}`);
 
  return data;
};



const fetchComments = async (articleId) => {
  const { data } = await axios.get(`${API_URL}/comments/article/${articleId}`);
  return data;
};

const deleteArticle = ({ token, id }) => {
    return axios.delete(`${API_URL}/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

function ArticlePage() {
  const { slug } = useParams(); // Pega o 'slug' da URL
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Busca os dados do artigo
  const { data: article, isLoading: articleLoading, error: articleError } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchArticleBySlug(slug),
  });

  const isLexicalContent = (content) => {
  try {
    // Se a string não começar com '{', não é um JSON que nos interessa.
    if (typeof content !== 'string' || !content.trim().startsWith('{')) {
      return false;
    }
    const parsed = JSON.parse(content);
    // Verificamos a propriedade 'root', que é a base de todo estado do Lexical.
    return typeof parsed === 'object' && parsed !== null && parsed.hasOwnProperty('root');
  } catch (e) {
    // Se JSON.parse falhar, não é um JSON.
    return false;
  }
};

  // Busca os comentários, mas SÓ DEPOIS que o artigo for carregado e tivermos um ID
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', article?.id],
    queryFn: () => fetchComments(article.id),
    enabled: !!article, // A query só é ativada quando 'article' não for nulo
  });

  // Mutação para deletar o artigo
  const deleteMutation = useMutation({
      mutationFn: deleteArticle,
      onSuccess: () => {
          toast.success('Artigo deletado com sucesso!');
          queryClient.invalidateQueries({ queryKey: ['articles'] }); // Invalida a lista de artigos na Home
          navigate('/');
      },
      onError: (error) => {
          toast.error(error.response?.data?.message || 'Erro ao deletar o artigo.');
      }
  });

  const handleDelete = () => {
      if (window.confirm('Tem certeza que deseja deletar este artigo?')) {
          deleteMutation.mutate({ token, id: article.id });
      }
  };

  if (articleLoading) {
    return <div className="page-container loading-message">Carregando artigo...</div>;
  }

  if (articleError) {
    return <div className="page-container error-message">Artigo não encontrado.</div>;
  }

  return (
     <div className="article-page-container">
      {/* Imagem de capa como um 'herói' no topo */}
      <header 
        className="article-hero" 
        style={{ backgroundImage: `url(${article.cover_image_url || 'https://cardbiss.com/wp-content/uploads/2023/04/sta-je-css.jpgS'})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <Link to="/knowledge" className="back-link">← Voltar para a knowledge</Link>
          <h1 className="hero-title">{article.title}</h1>
          <div className="article-meta">
            <span>Por: <strong>{article.User?.username}</strong></span>
            <span>Em: {new Date(article.publication_date).toLocaleDateString('pt-BR')}</span>
            <span>Categoria: <Link to={`/categoria/${article.Category?.slug}`}>{article.Category?.name}</Link></span>
          </div>
        </div>
      </header>

      {/* Conteúdo principal com coluna de leitura centralizada */}
      <main className="article-main-content">
          <article className="article-body">
          {/* --- MUDANÇA #2: Renderização Condicional --- */}
          {/* Verificamos o formato do conteúdo.
            - Se for Lexical, usamos nosso novo LexicalRenderer.
            - Se não (for o HTML antigo), usamos o método antigo.
          */}
          {isLexicalContent(article.content) ? (
            <LexicalRenderer jsonContent={article.content} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          )}
        </article>

        {/* Botões de Admin */}
        {user?.role === 'admin' && (
            <div className="admin-actions">
                <button className="edit-button">Editar</button>
                <button className="delete-button" onClick={handleDelete} disabled={deleteMutation.isPending}>
                    {deleteMutation.isPending ? 'Deletando...' : 'Deletar'}
                </button>
            </div>
        )}
        
        <hr className="separator" />

        {/* Seção de Comentários */}
        {commentsLoading ? (
          <p>Carregando comentários...</p>
        ) : (
          <CommentSection articleId={article.id} comments={comments || []} />
        )}
      </main>
    </div>
  );
}

export default ArticlePage;
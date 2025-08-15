import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import CustomSelect from '../components/CustomSelect';
import './ArticleEditor.css';
import { SimpleLexicalEditor } from '../editor/SimpleLexicalEditor.jsx';
import '../editor/SimpleLexicalEditor.css';





const API_URL = 'http://137.131.212.103:3000/api';


// --- Funções de API (fora do componente) ---


// Busca um artigo pelo seu ID (para o modo de edição)
const fetchArticleById = async (id) => {
  // Nota: Garanta que esta rota 'GET /api/articles/id/:id' existe no seu back-end.
  const { data } = await axios.get(`${API_URL}/articles/id/${id}`);
  return data;
};

// Busca todas as categorias para o dropdown
const fetchCategories = async () => {
    const { data } = await axios.get(`${API_URL}/categories`);
    return data;
};

// Salva o artigo (cria um novo ou atualiza um existente)
const saveArticle = ({ article, token, isEditing }) => {
    if (isEditing) {
        return axios.put(`${API_URL}/articles/${article.id}`, article, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
    return axios.post(`${API_URL}/articles`, article, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Lida com o upload da imagem para a nossa API. Retorna uma Promise.
const imageUploadHandler = (token) => async (blobInfo) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());

        axios.post(`${API_URL}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.data && response.data.location) { // Usamos 'location' como corrigido
                resolve(response.data.location); // Resolve a Promise com a URL
            } else {
                reject('Formato de resposta da API inválido.');
            }
        })
        .catch(error => {
            const errorMessage = error.response?.data?.message || error.message;
            reject('Falha no upload da imagem: ' + errorMessage);
        });
    });
};


// --- Componente Principal ---

function ArticleEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { token, theme } = useAuth(); 
  const queryClient = useQueryClient();

  const editorRef = useRef(null);
  // Estados do formulário
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // Busca de dados com TanStack Query
  const { data: articleData, isLoading: isArticleLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticleById(id),
    enabled: isEditing, // Só roda se 'id' existir (modo de edição)
  });

  const { data: categories, isLoading: areCategoriesLoading } = useQuery({ 
    queryKey: ['categories'], 
    queryFn: fetchCategories 
  });

  // Efeito para preencher o formulário quando os dados do artigo chegam
  useEffect(() => {
    if (isEditing && articleData) {
      setTitle(articleData.title);
      setContent(articleData.content);
      setCategoryId(articleData.categoryId);
      setCoverImageUrl(articleData.cover_image_url);
    }
  }, [isEditing, articleData]);

    const mutation = useMutation({
    mutationFn: saveArticle,
    onSuccess: (response) => {
      toast.success(`Artigo ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      // Assumindo que sua API retorna o slug para redirecionamento
      if (response.data.slug) {
        queryClient.invalidateQueries({ queryKey: ['article', response.data.slug] });
        navigate(`/artigo/${response.data.slug}`);
      } else {
        navigate('/'); // Fallback
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Ocorreu um erro ao salvar.');
    }
  });

  // Mutação para salvar os dados
   const handleSubmit = (event) => {
    event.preventDefault();

    // Pega o conteúdo mais recente diretamente do editor
    const latestContent = editorRef.current?.getEditorStateJSON();

    // Validação extra
    if (!latestContent || !title || !categoryId) {
        toast.error("Por favor, preencha o título, conteúdo e categoria.");
        return;
    }

    const articlePayload = {
      id,
      title,
      content: latestContent, // Usa o conteúdo mais recente
      categoryId,
      cover_image_url: coverImageUrl,
    };
    mutation.mutate({ article: articlePayload, token, isEditing });

    console.log('Dados do artigo:', {
      id,
      title,
      content: latestContent,
      categoryId,
      cover_image_url: coverImageUrl,
});

  };
  

  // Memoiza a função de upload para evitar recriações desnecessárias
  const memoizedUploadHandler = useCallback(imageUploadHandler(token), [token]);

  if (isArticleLoading || areCategoriesLoading) return <div>Carregando editor...</div>;

  return (
     <form onSubmit={handleSubmit} className="editor-layout" data-theme={theme} >
       <header className="editor-header">
        <h1>{isEditing ? 'Editar Artigo' : 'Criar Novo Artigo'}</h1>
        
        {/* Container para os botões de ação */}
        <div className="header-actions">
          <button 
            type="button" // Importante: 'type="button"' impede que ele envie o formulário
            className="btn-cancel" 
            onClick={() => navigate('/')} // Navega de volta para a Home
          >
            Cancelar
          </button>
          <button type="submit" className="btn-save-article" disabled={mutation.isPending}>
            {mutation.isPending ? 'Salvando...' : 'Publicar'}
          </button>
        </div>
      </header>

      <main className="editor-main">
           <SimpleLexicalEditor 
                    ref={editorRef}
                    initialContent={content} 
                    themeMode={theme}
                />
      </main>

      <aside className="editor-sidebar">
        <div className="sidebar-section">
          <h3>Detalhes</h3>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="coverImage">URL da Imagem de Capa</label>
            <input type="text" id="coverImage" value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="category">Categoria</label>
            <CustomSelect 
              options={categories || []}
              value={categoryId}
              onChange={(value) => setCategoryId(value)}
              placeholder="Selecione uma categoria"
            />
          </div>
        </div>
      </aside>
    </form>
  );
}

export default ArticleEditor;
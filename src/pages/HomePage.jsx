import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import apiClient from '../api/axiosConfig'; 
import { useQuery, useQueryClient  } from '@tanstack/react-query'; // Importa o hook principal
import { useAuth } from '../context/AuthContext';

import NewsGrid from '../components/NewsGrid';
import './HomePage.css';
import ArticleCard from '../components/ArticleCard';
import HeroJangada from '../components/HeroJangada';
import CertificationBanner from '../components/CertificationBanner';
import Pagination from '../components/Pagination';
import NewsCarousel from '../components/NewsCarousel';




// Função que busca os artigos da NOSSA API. Ela fica fora do componente.
const fetchArticles = async ({ queryKey }) => {
  // O queryKey nos dá acesso aos parâmetros do filtro
  const [_key, { searchTerm, selectedCategory, currentPage }] = queryKey;
  
  const params = new URLSearchParams();
  if (searchTerm) params.append('search', searchTerm);
  if (selectedCategory) params.append('categoryId', selectedCategory);
  params.append('page', currentPage);
  params.append('limit', 5);

  const { data } = await apiClient.get(`/articles`, { params });
  return data;
};

// Função que busca as notícias da API externa.
const fetchMicrosoftNews = async ({ queryKey }) => {
  const [_key, { currentPage }] = queryKey;
  
  const { data } = await apiClient.get(`/news`, { params: { page: currentPage, pageSize: 6 } });
  return data;
}



function HomePage() {
  const { user } = useAuth();

  // Estados para controlar a UI de filtros
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

   const [newsCurrentPage, setNewsCurrentPage] = useState(1);
   const queryClient = useQueryClient();
  
  // Hook do TanStack Query para buscar e gerenciar o cache dos ARTIGOS
  const { 
    data: articleData, 
    isLoading: articlesLoading, 
    error: articlesError 
  } = useQuery({
    queryKey: ['articles', { searchTerm, selectedCategory, currentPage }],
    queryFn: fetchArticles,
    keepPreviousData: true, // Melhora a UX na paginação
  });

  const { 
    data: newsData, 
    isLoading: newsLoading,
    error: newsError // <<-- ADICIONADO AQUI
  } = useQuery({
    queryKey: ['microsoftNews', { currentPage: newsCurrentPage }],
    queryFn: fetchMicrosoftNews,
    staleTime: 1000 * 60 * 30,
    keepPreviousData: true,
  });

   useEffect(() => {
    // Se não houver dados ou se já estivermos na última página, não faz nada
    if (!newsData || newsCurrentPage >= (newsData.totalPages || 10)) {
      return;
    }

    // Cria a "chave" da próxima página de notícias
    const nextPageQueryKey = ['microsoftNews', { currentPage: newsCurrentPage + 1 }];
    
    // Dispara a pré-busca para a próxima página
    queryClient.prefetchQuery({
        queryKey: nextPageQueryKey,
        queryFn: fetchMicrosoftNews
    });

  }, [newsData, newsCurrentPage, queryClient]); 
  // Hook do TanStack Query para buscar e gerenciar o cache das NOTÍCIAS
   

  // Efeito que busca as categorias para a sidebar (roda apenas uma vez)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get(`/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error("Erro ao buscar categorias", err);
      }
    };
    fetchCategories();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
    const handleNewsPageChange = (page) => {
    setNewsCurrentPage(page);
  };

   console.log('Status da busca de notícias:', { 
    isLoading: newsLoading, 
    error: newsError, 
    data: newsData 
  });
  // Combina os estados de carregamento
  const isLoading = articlesLoading || newsLoading;

  return (
    <div className="knowledge-dashboard">
     { /*<Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={(catId) => {
          setSelectedCategory(catId);
          setCurrentPage(1);
        }}
      />*/}
      <main className="knowledge-main">
        <div className="page-header">
          {/*<SearchBar
            searchTerm={searchTerm}
            onSearchChange={(term) => {
              setSearchTerm(term);
              setCurrentPage(1);
            }}
          />*/}
        </div>
        <HeroJangada/>
         

        {isLoading && <p className="loading-message">Buscando conteúdo...</p>}
        {articlesError && <p className="error-message">Não foi possível carregar os artigos.</p>}
        
        {/* Usamos 'articleData' que vem do useQuery */}
        {articleData && (
          <>
            <section>
               <div className="section-header">
                <h2 className="section-title">Descobertas Recentes</h2>
                <p className="section-subtitle">
                  Nossas últimas análises, guias e reflexões para sua jornada de aprendizado.
                </p>
              </div>
              <div className="article-list">
                {articleData.articles.length > 0 ? (
                  articleData.articles.map(article => (
                    <Link to={`/artigo/${article.slug}`} key={article.id} className="articsle-card">
                      <ArticleCard key={article.id} article={article}/>
                      {/*<div className="card-content">
                        <h3 className="card-title">{article.title}</h3>
                        <div className="card-meta">
                          <span>Autor: {article.User?.username || '...'}</span>
                          <span>Categoria: {article.Category?.name || '...'}</span>
                        </div>
                      </div>*/}
                    </Link>
                  ))
                ) : (
                  <p>Nenhum artigo encontrado com estes filtros.</p>
                )}
              </div>
            </section>
            
            {/*<Pagination 
              currentPage={currentPage}
              totalPages={articleData.totalPages}
              onPageChange={handlePageChange}
            />*/}
          </>
        )}
        
        {/* Usamos 'microsoftNews' que também vem do seu próprio useQuery */}
           {newsData?.news && (
              <NewsCarousel
                news={newsData.news}
                currentPage={newsCurrentPage}
                totalPages={newsData.totalPages}
                onPageChange={handleNewsPageChange}
              />
            )}
        <div className='box_certificate'>
          <CertificationBanner/>
        </div>
        
        
      </main>
      
    </div>
  );
}

export default HomePage;
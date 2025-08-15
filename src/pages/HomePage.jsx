import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query'; // Importa o hook principal
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import NewsGrid from '../components/NewsGrid';
import './HomePage.css';
import ArticleCard from '../components/ArticleCard';
import HeroJangada from '../components/HeroJangada';
import Footer from '../components/Footer';
import CertificationBanner from '../components/CertificationBanner';


const API_URL = 'http://137.131.212.103:3000/api';
const NEWS_API_KEY = "1e8f2b8f70f849aeb216d4f97f814822";

// Função que busca os artigos da NOSSA API. Ela fica fora do componente.
const fetchArticles = async ({ queryKey }) => {
  // O queryKey nos dá acesso aos parâmetros do filtro
  const [_key, { searchTerm, selectedCategory, currentPage }] = queryKey;
  
  const params = new URLSearchParams();
  if (searchTerm) params.append('search', searchTerm);
  if (selectedCategory) params.append('categoryId', selectedCategory);
  params.append('page', currentPage);
  params.append('limit', 5);

  const { data } = await axios.get(`${API_URL}/articles`, { params });
  return data;
};

// Função que busca as notícias da API externa.
const fetchMicrosoftNews = async () => {
    if (!NEWS_API_KEY) return []; // Não faz a busca se a chave não existir
    const { data } = await axios.get(`https://newsapi.org/v2/everything?q=microsoft&language=pt&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`);
    return data.articles.slice(0, 6);
}


function HomePage() {
  const { user } = useAuth();

  // Estados para controlar a UI de filtros
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
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

  // Hook do TanStack Query para buscar e gerenciar o cache das NOTÍCIAS
  const { 
      data: microsoftNews, 
      isLoading: newsLoading 
  } = useQuery({
    queryKey: ['microsoftNews'],
    queryFn: fetchMicrosoftNews,
    staleTime: 1000 * 60 * 30 // Considera os dados "novos" por 30 minutos
  });

  // Efeito que busca as categorias para a sidebar (roda apenas uma vez)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
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
        {microsoftNews && <NewsGrid news={microsoftNews} />}
        <div className='box_certificate'>
          <CertificationBanner/>
        </div>
        
        
      </main>
      
    </div>
  );
}

export default HomePage;
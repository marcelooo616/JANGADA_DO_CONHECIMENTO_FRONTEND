// src/pages/KnowledgePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useDebounce from '../hooks/useDebounce'; // Assumindo que está em src/hooks/
import ArticleCard from '../components/ArticleCard';
import './KnowledgePage.css';
import CategoryDropdown from '../components/CategoryDropdown';

// --- Sua lógica de API fora do componente ---
const API_URL = 'http://137.131.212.103:3000/api';

const fetchArticles = async ({ queryKey }) => {
  const [_key, { searchTerm, selectedCategory, currentPage }] = queryKey;
  
  const params = new URLSearchParams();
  if (searchTerm) params.append('search', searchTerm);
  if (selectedCategory && selectedCategory !== 'Todas') {
    params.append('categoryId', selectedCategory);
  }
  params.append('page', currentPage);
  params.append('limit', 8);

  const { data } = await axios.get(`${API_URL}/articles`, { params });
  return data;
};

const KnowledgePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Criamos a versão "atrasada" do termo de busca
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const { 
    data: articleData, 
    isLoading, 
    isError,
    error
  } = useQuery({
    // ===== AQUI ESTÁ A CORREÇÃO! =====
    // A queryKey agora depende do debouncedSearchTerm.
    // A busca só será refeita quando ESTE valor mudar (após a pausa na digitação).
    queryKey: ['articles', { searchTerm: debouncedSearchTerm, selectedCategory, currentPage }],
    // ===================================
    queryFn: fetchArticles,
    keepPreviousData: true,
  });

  useEffect(() => {
    const fetchCategoriesForFilter = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(['Todas', ...response.data]); 
      } catch (err) {
        console.error("Erro ao buscar categorias", err);
      }
    };
    fetchCategoriesForFilter();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (articleData?.totalPages || 1)) {
        setCurrentPage(newPage);
    }
  };

  return (
    <div className="knowledge-page">
      {/* O resto do seu JSX permanece exatamente o mesmo */}
      <div className="section-header">
        <h2 className="section-title">Base de Conhecimento</h2>
        <p className="section-subtitle">Encontre artigos, guias e procedimentos para auxiliar no seu dia a dia.</p>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="search"
            placeholder="Pesquisar por título ou conteúdo..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <CategoryDropdown 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

      </div>

      {isLoading && <p className="loading-message">Carregando artigos...</p>}
      {isError && <p className="error-message">Erro ao carregar artigos: {error.message}</p>}
      
      {!isLoading && !isError && (
        <>
          <div className="articles-grid">
            {articleData?.articles?.map(article => (
              <Link to={`/artigo/${article.slug}`} key={article.id} className="articsle-card"><ArticleCard key={article.id} article={article} /></Link>
              
            ))}
          </div>

          {articleData?.articles?.length > 0 && (
            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Anterior
              </button>
              <span className="pagination-info">
                Página {currentPage} de {articleData?.totalPages || 1}
              </span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === articleData?.totalPages || !articleData?.totalPages}>
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default KnowledgePage;
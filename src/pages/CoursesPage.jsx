import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axiosConfig'; // Usando nossa instância central do Axios
import useDebounce from '../hooks/useDebounce';
import CourseCard from '../components/CourseCard';
import './CoursesPage.css'; // Estilo que vamos criar
import CategoryDropdown from '../components/CategoryDropdown';

// Funções de API
const fetchCourses = async ({ queryKey }) => {
  const [_key, { searchTerm, selectedCategory, currentPage }] = queryKey;
  const params = new URLSearchParams({ page: currentPage, limit: 9 });
  if (searchTerm) params.append('search', searchTerm);
  if (selectedCategory && selectedCategory !== 'Todas') {
    params.append('categoryId', selectedCategory);
  }
  const { data } = await apiClient.get('/courses', { params });
  return data;
};

const fetchCategories = async () => {
  const { data } = await apiClient.get('/categories');
  return ['Todas', ...data]; // Adiciona a opção "Todas"
};


const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Busca de dados
  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: coursesData, isLoading, isError } = useQuery({
    queryKey: ['courses', { searchTerm: debouncedSearchTerm, selectedCategory, currentPage }],
    queryFn: fetchCourses,
    keepPreviousData: true,
  });

 const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    setCurrentPage(1); 
  };

  return (
    <div className="courses-page-container">
      <div className="section-header">
        <h2 className="section-title">Explore Nossos Cursos</h2>
        <p className="section-subtitle">Encontre a trilha de conhecimento perfeita para impulsionar sua carreira.</p>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="search"
            placeholder="Pesquisar por nome do curso..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CategoryDropdown
          categories={categoriesData || []}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {isLoading && <p>Carregando cursos...</p> /* TODO: Usar Skeleton Loader */}
      {isError && <p>Erro ao carregar os cursos.</p>}

      <div className="courses-grid">
        {coursesData?.courses?.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
        <span>Página {currentPage} de {coursesData?.totalPages || 1}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === coursesData?.totalPages}>Próxima</button>
      </div>
    </div>
  );
};

export default CoursesPage;
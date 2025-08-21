// src/App.jsx

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';



import './App.css';
import ArticlePage from './components/ArticlePage';
import ArticleEditor from './components/ArticleEditor';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import KnowledgePage from './pages/KnowledgePage';
import CategoriesPage from './pages/CategoriesPage';
import AdminLayout from './pages/admin/AdminLayout'; 
import UsersPage from './pages/admin/UsersPage'; 
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CoursesPage from './pages/CoursesPage';
import UserDashboardPage from './pages/UserDashboardPage';
import CoursePlayerLayout from './pages/courses/CoursePlayerLayout'; 
import LessonPage from './pages/courses/LessonPage';  
import CourseEditorPage from './pages/admin/CourseEditorPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';

function App() {
  return (
    <BrowserRouter>
      {/* Menu de Navegação Simples (opcional) */}
      <div className='nav'>
        <Navbar />
      </div>
      

       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      {/* Define as rotas da aplicação */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/artigo/:slug" element={<ArticlePage />} />
        <Route path="/knowledge" element={<KnowledgePage/>} />
        <Route path="/categorias" element={<CategoriesPage/>} />
        <Route path="/cursos" element={<CoursesPage />} />
        <Route path="/dashboard" element={<UserDashboardPage />} />

        <Route path="/cursos/:courseId" element={<CoursePlayerLayout />}>
          {/* Rota filha que renderiza a aula específica na área de conteúdo */}
          <Route path="aula/:lessonId" element={<LessonPage />} />
        </Route>

         {/* Rotas de Admin */}
        <Route path="/admin/artigo/novo" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
        <Route path="/admin/artigo/editar/:id" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />

         <Route path="/admin" element={<AdminLayout />}>
          {/* Rota "filha" para categorias */}
          <Route path="categories" element={<CategoriesPage />} /> 
          <Route path="courses" element={<AdminCoursesPage />} />
          {/* Rota "filha" para usuários */}
          <Route path="users" element={<UsersPage />} />
          {/* Você pode adicionar uma rota "index" para o dashboard inicial aqui */}
          <Route index element={<AdminDashboardPage />} /> 
          <Route path="cursos/:courseId/editar" element={<CourseEditorPage />} />
        </Route>
      </Routes>

      <Footer/>
    </BrowserRouter>
  );
}

export default App;
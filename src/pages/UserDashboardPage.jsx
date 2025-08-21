import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axiosConfig';
import './UserDashboardPage.css'; // Criaremos a seguir
import ProfileHeader from '../components/dashboard/ProfileHeader';
import EnrolledCoursesList from '../components/dashboard/EnrolledCoursesList';
import AchievementsList from '../components/dashboard/AchievementsList';
// Ainda não criamos os sub-componentes, mas já vamos deixar o esqueleto pronto
// import ProfileHeader from '../components/dashboard/ProfileHeader';
// import EnrolledCoursesList from '../components/dashboard/EnrolledCoursesList';

// Função para buscar os dados do dashboard do usuário logado
const fetchDashboardData = async () => {
  const { data } = await apiClient.get('/dashboard/me');
  return data;
};

const UserDashboardPage = () => {
  const { data: dashboardData, isLoading, isError } = useQuery({
    queryKey: ['dashboardMe'],
    queryFn: fetchDashboardData
  });

  if (isLoading) {
    return <div className="dashboard-container"><p>Carregando seu progresso...</p></div>;
    // TODO: Usar um Skeleton Loader mais elaborado aqui
  }

  if (isError) {
    return <div className="dashboard-container"><p>Ocorreu um erro ao buscar seus dados.</p></div>;
  }

  return (
    <div className="dashboard-container">
      {/* Por enquanto, vamos exibir os dados como texto para confirmar que a API funciona */}
      
       <ProfileHeader profile={dashboardData.profile} stats={dashboardData.stats} />
        <EnrolledCoursesList courses={dashboardData.enrolledCourses} />
         <AchievementsList achievements={dashboardData.achievements} />

      {/* --- ESTRUTURA FINAL (quando os sub-componentes estiverem prontos) ---
        <ProfileHeader profile={dashboardData.profile} stats={dashboardData.stats} />
        <EnrolledCoursesList courses={dashboardData.enrolledCourses} />
      */}
    </div>
  );
};

export default UserDashboardPage;
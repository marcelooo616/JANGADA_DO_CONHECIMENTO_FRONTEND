import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axiosConfig';
import { toast } from 'react-toastify';
import './ModuleList.css'; // Criaremos a seguir

// Componente para a lista de aulas (ainda a ser criado em detalhe)
const LessonList = ({ lessons, moduleId, onAddLesson }) => {
  return (
    <ul className="lesson-list-admin">
      {lessons.map(lesson => (
        <li key={lesson.id}>{lesson.title}</li>
      ))}
      {/* O botão agora chama a função recebida, passando o ID do módulo */}
      <li><button onClick={() => onAddLesson(moduleId)} className="add-lesson-btn">+ Adicionar Aula</button></li>
    </ul>
  );
};


const ModuleList = ({ course, onAddModule, onAddLesson }) => {
  const [openModuleId, setOpenModuleId] = useState(null);

  const toggleModule = (moduleId) => {
    setOpenModuleId(prevId => (prevId === moduleId ? null : moduleId));
  };

  return (
    <div className="module-list-container">
      {course.modules?.map((module, index) => (
        <div key={module.id} className="module-item">
          <button className="module-header" onClick={() => toggleModule(module.id)}>
            <div className="module-header-title">
              <i className="fas fa-grip-vertical"></i>
              <span>Módulo {index + 1}: {module.title}</span>
            </div>
            <i className={`fas fa-chevron-down ${openModuleId === module.id ? 'open' : ''}`}></i>
          </button>
          {openModuleId === module.id && (
            <div className="module-content">
              <LessonList lessons={module.lessons} moduleId={module.id} onAddLesson={onAddLesson}  />
            </div>
          )}
        </div>
      ))}
       <button onClick={onAddModule} className="add-module-btn">+ Adicionar Módulo</button>
    </div>
  );
};

export default ModuleList;
import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import QuestionnaireList from './QuestionnaireList';
import QuestionnaireForm from './QuestionnaireForm';
import PatientSelector from './PatientSelector';
import './PreOpModule.css';

const PreOpModule = () => {
  const [view, setView] = useState('list'); // 'list', 'create', 'edit'
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  const handleCreate = (caseId) => {
    setSelectedCaseId(caseId);
    setView('create');
  };

  const handleEdit = (id) => {
    setSelectedId(id);
    setView('edit');
  };

  const handleBack = () => {
    setView('list');
    setSelectedId(null);
    setSelectedCaseId(null);
  };

  return (
    <div className="preop-module animate-fade-in">
      {view === 'list' && (
        <div className="module-view">
          <div className="view-header">
            <h2 className="view-title">Questionnaires Pré-opératoires</h2>
            <PatientSelector onSelectCase={handleCreate} />
          </div>
          <QuestionnaireList onEdit={handleEdit} />
        </div>
      )}

      {(view === 'create' || view === 'edit') && (
        <div className="module-view">
          <div className="view-header">
            <button className="btn btn-ghost btn-sm" onClick={handleBack}>
              ← Retour à la liste
            </button>
            <h2 className="view-title">
              {view === 'create' ? 'Nouveau Questionnaire' : 'Modification Questionnaire'}
            </h2>
          </div>
          <QuestionnaireForm 
            id={selectedId} 
            caseId={selectedCaseId} 
            onSuccess={handleBack} 
          />
        </div>
      )}
    </div>
  );
};

export default PreOpModule;

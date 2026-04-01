import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';

const QuestionnaireList = ({ onEdit }) => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      const response = await api.getQuestionnaires();
      setQuestionnaires(response.data);
    } catch (error) {
      console.error("Erreur list", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VALIDATED': return <span className="badge badge-emerald">Validé</span>;
      case 'SUBMITTED': return <span className="badge badge-blue">Soumis</span>;
      case 'CORRECTED': return <span className="badge badge-violet">Corrigé</span>;
      default: return <span className="badge badge-amber">Brouillon</span>;
    }
  };

  if (loading) return <div className="skeleton" style={{ height: '200px' }}></div>;

  return (
    <div className="glass-card list-container overflow-hidden">
      <table className="data-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Langue</th>
            <th>Statut</th>
            <th>Date Création</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questionnaires.length > 0 ? (
            questionnaires.map((q) => (
              <tr key={q.id}>
                <td>
                  <div className="patient-link">
                    <span className="patient-id-mini">#{q.case_id?.substring(0, 8)}</span>
                    <span className="patient-cell-name">Cas Patient</span>
                  </div>
                </td>
                <td>
                  <span className="lang-badge">{q.language === 'fr' ? '🇫🇷 FR' : '🇦🇪 AR'}</span>
                </td>
                <td>{getStatusBadge(q.validation_status)}</td>
                <td>{new Date(q.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(q.id)}>
                    Ouvrir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                <div className="empty-state">
                  <span className="empty-state-icon">📄</span>
                  <p>Aucun questionnaire trouvé</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <style>{`
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .data-table th {
          padding: var(--space-md) var(--space-lg);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          border-bottom: 1px solid var(--border-color);
          background: rgba(255, 255, 255, 0.02);
        }
        .data-table td {
          padding: var(--space-md) var(--space-lg);
          border-bottom: 1px solid var(--border-color);
          font-size: 0.875rem;
          color: var(--text-primary);
        }
        .data-table tr:hover td {
          background: var(--bg-input);
        }
        .patient-link {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .patient-id-mini {
          font-family: monospace;
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .patient-cell-name {
          font-weight: 500;
        }
        .lang-badge {
          font-size: 0.8rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default QuestionnaireList;

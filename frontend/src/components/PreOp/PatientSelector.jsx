import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';

const PatientSelector = ({ onSelectCase }) => {
  const [cases, setCases] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCases = async () => {
    setLoading(true);
    try {
      // Filtrer les cas en PRE_OP pour de nouveaux questionnaires
      const response = await api.getCases();
      const preopCases = response.data.filter(c => c.status === 'PRE_OP');
      setCases(preopCases);
      setShowDropdown(true);
    } catch (error) {
      console.error("Erreur cas", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-selector">
      <button 
        className="btn btn-primary" 
        onClick={() => !showDropdown ? fetchCases() : setShowDropdown(false)}
        disabled={loading}
      >
        {loading ? '...' : '+ Nouveau Questionnaire'}
      </button>

      {showDropdown && (
        <div className="selector-dropdown glass-card">
          <div className="dropdown-header">Choisir un Patient / Dossier</div>
          <div className="case-list">
            {cases.length > 0 ? (
              cases.map((c) => (
                <div key={c.id} className="case-option" onClick={() => {
                  onSelectCase(c.id);
                  setShowDropdown(false);
                }}>
                  <div className="case-option-name">{c.patient_full_name}</div>
                  <div className="case-option-meta">
                    {(!c.surgery_type || c.surgery_type === 'UNKNOWN')
                      ? <em style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Chirurgie non renseignée</em>
                      : c.surgery_type.replace(/_/g, ' ').toLowerCase().replace(/^./, x => x.toUpperCase())}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-options">Aucun dossier pré-op disponible</div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .patient-selector {
          position: relative;
        }
        .selector-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 300px;
          z-index: 200;
          padding: 0;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }
        .dropdown-header {
          padding: 12px 16px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid var(--border-color);
        }
        .case-list {
          max-height: 250px;
          overflow-y: auto;
        }
        .case-option {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid var(--border-color);
          transition: background 0.2s;
        }
        .case-option:hover {
          background: var(--bg-input);
        }
        .case-option-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        .case-option-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .no-options {
          padding: 16px;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default PatientSelector;

import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';

const DecisionPanel = ({ caseId, currentDecision, onDecisionChange }) => {
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState(currentDecision || '');

  // Synchroniser l'état local si currentDecision change (ex: après chargement initial dans le parent)
  useEffect(() => {
    if (currentDecision) {
      setDecision(currentDecision);
    }
  }, [currentDecision]);

  const options = [
    { value: 'AUTHORIZED', label: 'Autoriser l’anesthésie', color: 'badge-emerald' },
    { value: 'EXAMS_REQUIRED', label: 'Examens complémentaires', color: 'badge-amber' },
    { value: 'SPECIALIST_OPINION', label: 'Avis spécialisé', color: 'badge-blue' },
    { value: 'REFUSED', label: 'Récuser l’anesthésie', color: 'badge-rose' },
  ];

  const handleDecision = async (val) => {
    setLoading(true);
    try {
      await api.updateCase(caseId, { decision: val });
      setDecision(val);
      if (onDecisionChange) onDecisionChange(val);
    } catch (error) {
      console.error("Decision update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="decision-panel glass-card animate-fade-in">
      <div className="panel-header-alt">
        <div className="panel-title-area">
          {/* Title removed here as it is redundant with CaseReviewDetail wrapper */}
        </div>
      </div>
      <div className="decision-options">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`decision-btn ${decision === opt.value ? 'active' : ''}`}
            onClick={() => handleDecision(opt.value)}
            disabled={loading}
          >
            <span className={`badge-dot ${decision === opt.value ? opt.color : ''}`}></span>
            {opt.label}
          </button>
        ))}
      </div>
      
      {decision && (
        <div className="decision-status-summary">
          Statut actuel: <span className="badge badge-blue">{options.find(o => o.value === decision)?.label}</span>
        </div>
      )}

      <style>{`
        .decision-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }

        .decision-btn {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          border-radius: 8px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          color: #94a3b8;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .decision-btn:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.1);
          transform: translateX(4px);
        }

        .decision-btn.active {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.4);
          color: #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .decision-status-summary {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 0.75rem;
          color: #64748b;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default DecisionPanel;

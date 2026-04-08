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
          gap: 10px;
          margin-top: 16px;
        }

        .decision-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 10px;
          background: #ffffff;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
          box-shadow: var(--shadow-sm);
        }

        .decision-btn:hover {
          background: #f4f8ff;
          border-color: rgba(91, 141, 239, 0.3);
          color: var(--text-primary);
          transform: translateX(4px);
        }

        .decision-btn.active {
          background: rgba(91, 141, 239, 0.1);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          box-shadow: 0 2px 10px rgba(91, 141, 239, 0.15);
        }

        .badge-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--border-color);
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .badge-dot.badge-emerald { background: #059669; }
        .badge-dot.badge-amber { background: #d97706; }
        .badge-dot.badge-blue { background: var(--accent-primary); }
        .badge-dot.badge-rose { background: #dc2626; }

        .decision-status-summary {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default DecisionPanel;

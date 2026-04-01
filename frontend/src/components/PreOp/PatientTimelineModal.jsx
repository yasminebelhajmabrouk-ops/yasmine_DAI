import React from 'react';
import './PreOpModule.css';

const PatientTimelineModal = ({ isOpen, onClose, logs, patientName }) => {
  if (!isOpen) return null;

  const formatAction = (action) => {
    switch (action) {
      case 'CREATE': return 'Dossier Créé';
      case 'COMPUTE_SCORES': return 'IA : Analyse des Risques';
      case 'DECISION_MADE': return 'Conclusion Médicale';
      case 'UPDATE': return 'Mise à jour Dossier';
      default: return action;
    }
  };

  const getIcon = (action) => {
    if (action.includes('IA') || action === 'COMPUTE_SCORES') return '🤖';
    if (action === 'CREATE') return '🆕';
    return '🩺';
  };

  return (
    <div className="dicom-modal-overlay"> {/* On réutilise cette classe pour le flou arrière-plan */}
      <div className="timeline-modal-content glass-card">
        <div className="timeline-modal-header">
          <h3>Parcours de Soin</h3>
          <span>Historique complet : {patientName}</span>
          <button className="btn-close-dicom" onClick={onClose}>×</button>
        </div>

        <div className="timeline-body">
          {logs.length === 0 ? (
            <div className="timeline-empty">Aucun historique disponible pour ce dossier.</div>
          ) : (
            <div className="timeline-container">
              {logs.map((log, idx) => (
                <div key={log.id} className="timeline-item">
                  <div className="timeline-marker">
                    <span className="marker-icon">{getIcon(log.action)}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-time">
                      {new Date(log.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} • {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="timeline-action">{formatAction(log.action)}</div>
                    <div className="timeline-details">
                      {log.action === 'COMPUTE_SCORES' && log.details?.score_count && (
                        <span>{log.details.score_count} scores cliniques analysés par l'IA.</span>
                      )}
                      {log.actor && <span className="timeline-actor">Par {log.actor || 'Système'}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="timeline-footer">
          <button className="btn-primary" onClick={onClose}>Fermer le parcours</button>
        </div>
      </div>
    </div>
  );
};

export default PatientTimelineModal;

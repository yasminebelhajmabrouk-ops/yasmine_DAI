import React from 'react';
import { api } from '../../api/client';

const AlertItem = ({ alert, onUpdate }) => {
  const handleAcknowledge = async () => {
    try {
      await api.acknowledgeAlert(alert.id, { acknowledgment_comment: "Vu par le médecin de garde." });
      onUpdate();
    } catch (err) {
      console.error("Failed to acknowledge alert", err);
    }
  };

  const handleResolve = async () => {
    try {
      await api.resolveAlert(alert.id, { resolution_comment: "Situation stabilisée." });
      onUpdate();
    } catch (err) {
      console.error("Failed to resolve alert", err);
    }
  };

  const timeElapsed = Math.round((new Date() - new Date(alert.raised_at)) / 1000 / 60);

  return (
    <div className={`alert-item alert-${alert.severity} ${alert.status}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
         <span className="alert-title">{alert.alert_type}</span>
         <span className={`severity-badge ${alert.severity.toLowerCase()}`}>{alert.severity}</span>
      </div>
      
      <div className="alert-msg">{alert.message || alert.title}</div>
      
      <div className="alert-meta">
        <span className="alert-time">il y a {timeElapsed} min</span>
        <div className="alert-actions">
          {alert.status === 'ACTIVE' && (
            <button className="alert-btn" onClick={handleAcknowledge}>Acquitter</button>
          )}
          <button className="alert-btn" style={{ background: 'currentColor', color: '#0f172a' }} onClick={handleResolve}>
            Résoudre
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertItem;

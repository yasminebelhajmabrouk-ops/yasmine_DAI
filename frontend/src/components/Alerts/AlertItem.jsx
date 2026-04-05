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
        <div className="alert-actions" style={{ display: 'flex', gap: '10px' }}>
          {alert.status === 'ACTIVE' && (
            <button className="alert-btn" onClick={handleAcknowledge} style={{ borderRadius: '50px', padding: '6px 18px', fontWeight: '700' }}>
              Acquitter
            </button>
          )}
          <button 
            className="alert-btn" 
            style={{ borderRadius: '50px', padding: '6px 18px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} 
            onClick={handleResolve}
          >
            Résoudre
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertItem;

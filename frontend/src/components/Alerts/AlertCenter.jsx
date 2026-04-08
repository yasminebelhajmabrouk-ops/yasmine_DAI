import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import AlertItem from './AlertItem';
import './Alerts.css';

const AlertCenter = ({ caseId, isOpen, onClose }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (caseId) {
      fetchAlerts();
      const interval = setInterval(fetchAlerts, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [caseId]);

  const fetchAlerts = async () => {
    try {
      const res = await api.getCaseAlerts(caseId);
      // Filter out RESOLVED alerts
      const activeAlerts = res.data.filter(a => a.status !== 'RESOLVED');
      setAlerts(activeAlerts);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    const activeCount = alerts.length;
    return (
      <div className="alert-badge" onClick={onClose} title={`${activeCount} alerte(s) active(s)`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {activeCount > 0 && <div className="alert-count">{activeCount}</div>}
      </div>
    );
  }

  return (
    <>
      <div className="alert-center-overlay" onClick={onClose} />
      <div className="alert-center-panel">
        <header className="alert-center-header">
          <h3 style={{ margin: 0, fontWeight: '800' }}>CENTRE D'ALERTE CLINIQUE</h3>
          <button 
            className="btn-back-link" 
            onClick={onClose}
            style={{ marginBottom: 0, padding: '6px 14px', fontSize: '0.8rem' }}
          >
            × Fermer
          </button>
        </header>
        
        <div className="alert-list">
          {alerts.length === 0 ? (
            <div className="empty-state">Aucune alerte active pour le moment.</div>
          ) : (
            alerts.map(a => (
              <AlertItem key={a.id} alert={a} onUpdate={fetchAlerts} />
            ))
          )}
        </div>
        
        <footer style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
           Actualisation automatique toutes les 10s via le module backend d'alertes dynamiques.
        </footer>
      </div>
    </>
  );
};

export default AlertCenter;

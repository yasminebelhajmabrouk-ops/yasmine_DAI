import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import VitalsMonitor from './VitalsMonitor';
import EventTimeline from './EventTimeline';
import './PerOpModule.css';

const PerOpDashboard = ({ caseId, patientData, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
    
    // Polling mechanism could be added here for real-time updates
    const interval = setInterval(() => {
      if (sessionData && sessionData.session && sessionData.session.status === 'ACTIVE') {
        fetchSummary(false); // background fetch
      }
    }, 15000); // Poll every 15s when active

    return () => clearInterval(interval);
  }, [caseId]);

  const fetchSummary = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await api.getPerOpSummary(caseId);
      setSessionData(res.data);
    } catch (err) {
      console.error('Error fetching perop summary', err);
      setError('Impossible de charger les données per-opératoires.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    if (window.confirm("Démarrer la session d'anesthésie pour ce patient ? L'heure de début sera enregistrée formellement.")) {
      try {
        // Le backend exige que le dossier soit en statut 'PER_OP' avant de démarrer.
        await api.updateCase(caseId, { status: 'PER_OP' });
        
        // Ensuite, on démarre la session
        await api.startPerOpSession(caseId, { started_at: new Date().toISOString() });
        fetchSummary();
      } catch (err) {
        const errDetail = err.response?.data?.detail || (err.response?.data ? JSON.stringify(err.response.data) : err.message);
        alert("Erreur lors du démarrage : " + errDetail);
      }
    }
  };

  const handleEndSession = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir clôturer cette intervention ? Cette action est définitive.")) {
      try {
        await api.endPerOpSession(caseId, { ended_at: new Date().toISOString(), notes: "Intervention terminée." });
        fetchSummary();
      } catch (err) {
        alert("Erreur lors de la clôture : " + (err.response?.data?.detail || err.message));
      }
    }
  };

  if (loading && !sessionData) {
    return (
      <div className="pq-center">
        <div className="loader"></div>
        <p>Connexion à la salle d'opération...</p>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="pq-center">
        <p className="auth-error">{error}</p>
        <button className="pd-btn-outline" onClick={onBack}>Retour au tableau de bord</button>
      </div>
    );
  }

  const { session, latest_vitals, latest_events } = sessionData;
  const isStarted = !!session;
  const isActive = session?.status === 'ACTIVE';

  return (
    <div className="perop-container">
      <button className="btn-back-link" onClick={onBack} style={{ marginBottom: '0' }}>
        ← Retour au Dossier (Pré-op)
      </button>

      <div className="perop-header glass-card" style={{ marginTop: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#fff' }}>
            Monitoring Per-Opératoire
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
            Patient: {patientData?.first_name} {patientData?.last_name} • Bloc: Salle 4
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {!isStarted && (
            <button className="perop-btn primary" onClick={handleStartSession}>
              ▶ Démarrer l'Intervention
            </button>
          )}

          {isActive && (
            <>
              <div className="session-badge session-active">
                <div className="pulse-dot"></div>
                EN COURS
              </div>
              <button className="perop-btn danger" onClick={handleEndSession}>
                ⏹ Clôturer l'Intervention
              </button>
            </>
          )}

          {isStarted && !isActive && (
            <div className="session-badge session-ended">
              TERMINÉE
            </div>
          )}
        </div>
      </div>

      {!isStarted ? (
        <div className="glass-card section-card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚕️</div>
          <h3 style={{ color: '#e2e8f0', marginBottom: '8px' }}>En attente d'induction</h3>
          <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto' }}>
            La session per-opératoire n'a pas encore été démarrée pour ce patient. Cliquez sur le bouton "Démarrer" lorsque l'équipe est prête.
          </p>
        </div>
      ) : (
        <div className="perop-grid">
          <VitalsMonitor 
            caseId={caseId} 
            session={session} 
            vitals={latest_vitals} 
            onVitalsUpdated={() => fetchSummary(false)} 
          />
          <EventTimeline 
            caseId={caseId} 
            session={session} 
            events={latest_events} 
            onEventsUpdated={() => fetchSummary(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default PerOpDashboard;

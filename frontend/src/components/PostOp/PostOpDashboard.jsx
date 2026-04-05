import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import AldreteEvaluation from './AldreteEvaluation';
import ObservationHistory from './ObservationHistory';
import AlertCenter from '../Alerts/AlertCenter';
import './PostOpModule.css';

const PostOpDashboard = ({ caseId, patientData, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [isAlertCenterOpen, setIsAlertCenterOpen] = useState(false);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(() => {
      if (summary?.stay?.status === 'ACTIVE') {
        fetchSummary(false);
      }
    }, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, [caseId]);

  const fetchSummary = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await api.getPostOpSummary(caseId);
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch postop summary", err);
      setError("Impossible de charger les données post-opératoires.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const handleStartStay = async () => {
    if (window.confirm("Démarrer le séjour en salle de réveil pour ce patient ?")) {
      try {
        await api.updateCase(caseId, { status: 'POST_OP' });
        await api.startPostOpStay(caseId, { started_at: new Date().toISOString() });
        fetchSummary();
      } catch (err) {
        alert("Erreur lors de l'ouverture du séjour : " + (err.response?.data?.detail || err.message));
      }
    }
  };

  const handleEndStay = async () => {
    if (window.confirm("Clôturer le séjour en salle de réveil ? Cette action confirme la sortie du patient.")) {
      try {
        await api.endPostOpStay(caseId, { ended_at: new Date().toISOString(), notes: "Sortie autorisée par l'anesthésiste." });
        fetchSummary();
      } catch (err) {
        alert("Erreur lors de la clôture du séjour : " + (err.response?.data?.detail || err.message));
      }
    }
  };

  if (loading && !summary) {
    return (
      <div className="pq-center">
        <div className="loader"></div>
        <p>Connexion à la salle de réveil...</p>
      </div>
    );
  }

  const { stay, latest_observations } = summary || {};
  const isStarted = !!stay;
  const isActive = stay?.status === 'ACTIVE';
  
  // Latest Aldrete calculation
  const latestObs = latest_observations?.[0];
  const aldreteScore = latestObs ? (
    (latestObs.activity_score || 0) + 
    (latestObs.respiration_score || 0) + 
    (latestObs.circulation_score || 0) + 
    (latestObs.consciousness_score || 0) + 
    (latestObs.oxygenation_score || 0)
  ) : 0;
  
  const isReady = aldreteScore >= 9;

  return (
    <div className="postop-container">
      <button className="btn-back-link" onClick={onBack}>
        ← Retour au Dossier Anesthésie
      </button>

      <header className="postop-header glass-card">
        <div>
          <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#fff' }}>
            Surveillance Post-Opératoire (SSPRI)
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
            Patient : {patientData?.first_name} {patientData?.last_name} · Dossier : {caseId.substring(0,8)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <AlertCenter 
            caseId={caseId} 
            isOpen={isAlertCenterOpen} 
            onClose={() => setIsAlertCenterOpen(!isAlertCenterOpen)} 
          />
          {!isStarted ? (
            <button className="perop-btn primary" onClick={handleStartStay}>
              ▶ Admettre en SSPI
            </button>
          ) : isActive ? (
            <>
              <div className="session-badge session-active">
                <div className="pulse-dot"></div>
                SÉJOUR ACTIF
              </div>
              <button className="perop-btn danger" onClick={handleEndStay}>
                ⏹ Autoriser la Sortie
              </button>
            </>
          ) : (
            <div className="session-badge session-ended">
              SÉJOUR TERMINÉ
            </div>
          )}
        </div>
      </header>

      {!isStarted ? (
        <div className="glass-card section-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>🛌</div>
          <h3 style={{ color: '#e2e8f0', marginBottom: '12px' }}>En attente de transfert</h3>
          <p style={{ color: '#94a3b8', maxWidth: '450px', margin: '0 auto' }}>
            Le patient n'est pas encore admis en salle de réveil. Cliquez sur "Admettre en SSPI" dès réception du patient en provenance du bloc opératoire.
          </p>
        </div>
      ) : (
        <>
          {isActive && (
            <div className={`readiness-banner ${isReady ? 'ready-success' : 'not-ready-warning'}`}>
              <span style={{ fontSize: '1.2rem' }}>{isReady ? '✓' : '⚠'}</span>
              <div>
                <strong>{isReady ? 'Prêt pour la sortie' : 'Surveillance continue requise'}</strong>
                <span style={{ margin: '0 8px' }}>•</span>
                <span>Score d'Aldrete actuel : {aldreteScore} / 10</span>
                {!isReady && <span> (Minimum 9 requis pour la sortie)</span>}
              </div>
            </div>
          )}

          <div className="postop-grid">
            <div className="postop-main">
              {isActive && (
                <AldreteEvaluation 
                  caseId={caseId} 
                  onObservationAdded={() => fetchSummary(false)} 
                />
              )}
              <ObservationHistory observations={latest_observations} />
            </div>

            <aside className="postop-side">
              <div className="glass-card section-card" style={{ padding: '24px' }}>
                <h3 className="section-title-premium">SYNTHÈSE SESSION</h3>
                <div className="postop-summary-card">
                  <div>
                    <div className="total-score-badge" style={{ color: isReady ? '#10b981' : '#f59e0b' }}>
                      {aldreteScore}
                    </div>
                    <div className="total-score-label">Score Aldrete</div>
                  </div>
                  
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                    <div className="aldrete-label">Heure d'admission</div>
                    <div style={{ color: '#fff', fontWeight: '600' }}>
                      {new Date(stay.started_at).toLocaleString()}
                    </div>
                  </div>

                  {stay.ended_at && (
                    <div style={{ marginTop: '12px' }}>
                      <div className="aldrete-label">Heure de sortie</div>
                      <div style={{ color: '#fff', fontWeight: '600' }}>
                        {new Date(stay.ended_at).toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: '12px' }}>
                    <div className="aldrete-label">Notes de séjour</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '4px' }}>
                      {stay.notes || "Aucune note particulière."}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
};

export default PostOpDashboard;

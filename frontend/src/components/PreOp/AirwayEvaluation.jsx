import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard/PatientDashboard.css';

const AirwayEvaluation = () => {
  const navigate = useNavigate();

  return (
    <div className="pd-wrapper animate-fade-in">
      <div className="pd-container" style={{ maxWidth: '680px' }}>

        <div className="pq-header">
          <button className="pq-back-btn" onClick={() => navigate('/patient-dashboard')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2>
            <span role="img" aria-label="camera" style={{ fontSize: '1.4rem' }}>📷</span>
            Évaluation des Voies Aériennes
          </h2>
        </div>

        <div className="pd-panel pq-form" style={{ alignItems: 'center', textAlign: 'center', padding: '48px 24px' }}>
          <span style={{ fontSize: '3rem' }}>🔬</span>
          <h3 style={{ color: '#e2e8f0', marginTop: '20px' }}>Analyse IA — Bientôt disponible</h3>
          <p style={{ color: '#64748b', marginTop: '12px', lineHeight: '1.6', maxWidth: '400px' }}>
            L'évaluation automatique du score de Mallampati par intelligence artificielle est en cours de déploiement.
            <br /><br />
            Votre médecin anesthésiste réalisera cette évaluation lors de la consultation pré-opératoire.
          </p>

          <div style={{
            marginTop: '32px',
            padding: '16px 20px',
            backgroundColor: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#a5b4fc',
            fontSize: '0.88rem',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Cette fonctionnalité sera activée prochainement.
          </div>
        </div>

        <button
          style={{ backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '20px', padding: '10px 20px', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', width: 'fit-content', cursor: 'pointer' }}
          onClick={() => navigate('/patient-dashboard')}
        >
          ← Retour au tableau de bord
        </button>

      </div>
    </div>
  );
};

export default AirwayEvaluation;

import React from 'react';
import './QuestionnaireForm.css';

const ScorePanel = ({ scores, onCompute, loading }) => {
  const getRiskColor = (type, value) => {
    const val = parseFloat(value);
    if (isNaN(val)) return 'badge-cyan';
    
    // Logique simplifiée couleur de risque
    if (type === 'STOP_BANG') {
      if (val >= 5) return 'badge-rose';
      if (val >= 3) return 'badge-amber';
      return 'badge-emerald';
    }
    if (type === 'APFEL') {
      if (val >= 3) return 'badge-rose';
      if (val >= 2) return 'badge-amber';
      return 'badge-emerald';
    }
    return 'badge-cyan';
  };

  return (
    <div className="score-panel-premium glass-card">
      <div className="panel-header-alt">
        <div className="panel-title-area">
          <h3 className="premium-title">SYNTHÈSE DES RISQUES (IA)</h3>
          <p className="premium-subtitle">Analyse comparative basée sur les algorithmes cliniques</p>
        </div>
        <button 
          className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`} 
          onClick={onCompute}
          disabled={loading}
        >
          {loading ? 'Recalculer' : 'Relancer l\'Analyse'}
        </button>
      </div>

      <div className="scores-premium-grid">
        {scores && scores.length > 0 ? (
          scores.map(s => {
            const risk = getRiskColor(s.score_type, s.score_value);
            return (
              <div key={s.id || s.score_type} className={`score-card-alt ${risk}`}>
                <div className="score-card-header">
                  <span className="score-tag">{s.score_type.replace(/_/g, ' ')}</span>
                </div>
                <div className="score-card-body">
                  <div className="score-main-value">{s.score_value}</div>
                </div>
                <div className="score-card-footer">
                  <span>Mis à jour le {new Date(s.computed_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-scores">Calcul des scores en cours...</div>
        )}
      </div>

      <style>{`
        .score-panel-premium { padding: 32px; margin-bottom: 24px; }
        .panel-header-alt { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
        .premium-title { font-size: 0.85rem; font-weight: 800; letter-spacing: 0.1em; color: #fff; margin-bottom: 4px; }
        .premium-subtitle { font-size: 0.75rem; color: #64748b; }

        .scores-premium-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }

        .score-card-alt {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .score-card-alt:hover { transform: translateY(-2px); background: rgba(255,255,255,0.04); }

        .score-tag { font-size: 0.6rem; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; }
        .score-main-value { font-size: 1.1rem; font-weight: 600; color: #cbd5e1; line-height: 1.2; }
        .score-card-footer { font-size: 0.55rem; color: #334155; }

        /* Risk Colors */
        .score-card-alt.badge-emerald { border-left: 4px solid #10b981; }
        .score-card-alt.badge-amber { border-left: 4px solid #f59e0b; }
        .score-card-alt.badge-rose { border-left: 4px solid #ef4444; }
        .score-card-alt.badge-cyan { border-left: 4px solid #06b6d4; }
        
        .score-card-alt.badge-rose .score-main-value { color: #f87171; text-shadow: 0 0 10px rgba(248,113,113,0.3); }
        .score-card-alt.badge-amber .score-main-value { color: #fbbf24; }
        .score-card-alt.badge-emerald .score-main-value { color: #34d399; }
      `}</style>
    </div>
  );
};

export default ScorePanel;

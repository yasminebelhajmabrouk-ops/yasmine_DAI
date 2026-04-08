import React, { useState } from 'react';
import { api } from '../../api/client';

const ALDRETE_CATEGORIES = [
  { 
    id: 'activity_score', 
    label: 'Activité motrice', 
    options: [
      { value: 0, label: 'Incapable de bouger les membres' },
      { value: 1, label: 'Bouge 2 membres sur commande' },
      { value: 2, label: 'Bouge les 4 membres sur commande' }
    ]
  },
  { 
    id: 'respiration_score', 
    label: 'Respiration', 
    options: [
      { value: 0, label: 'Apnée' },
      { value: 1, label: 'Dyspnée ou respiration limitée' },
      { value: 2, label: 'Respire profondément et tousse' }
    ]
  },
  { 
    id: 'circulation_score', 
    label: 'Circulation (TA)', 
    options: [
      { value: 0, label: 'TA +/- 50% du niveau pré-op' },
      { value: 1, label: 'TA +/- 20-50% du niveau pré-op' },
      { value: 2, label: 'TA +/- 20% du niveau pré-op' }
    ]
  },
  { 
    id: 'consciousness_score', 
    label: 'Conscience', 
    options: [
      { value: 0, label: 'Pas de réponse' },
      { value: 1, label: 'Réveil à l\'appel' },
      { value: 2, label: 'Parfaitement réveillé' }
    ]
  },
  { 
    id: 'oxygenation_score', 
    label: 'Saturation (SpO2)', 
    options: [
      { value: 0, label: 'SpO2 < 90% même avec O2' },
      { value: 1, label: 'Besoin d\'O2 pour SpO2 > 90%' },
      { value: 2, label: 'SpO2 > 92% en air ambiant' }
    ]
  }
];

const AldreteEvaluation = ({ caseId, onObservationAdded }) => {
  const [scores, setScores] = useState({
    activity_score: null,
    respiration_score: null,
    circulation_score: null,
    consciousness_score: null,
    oxygenation_score: null,
  });
  const [vitals, setVitals] = useState({
    pain_score: 0,
    systolic_bp: '',
    spo2: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleScoreSelect = (category, value) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const totalScore = Object.values(scores).reduce((acc, val) => acc + (val || 0), 0);
  const isComplete = Object.values(scores).every(v => v !== null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isComplete) {
      alert("Veuillez remplir tous les critères d'Aldrete.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...scores,
        ...vitals,
        observation_time: new Date().toISOString()
      };
      
      // Cleanup empty numeric values
      if (payload.systolic_bp === '') delete payload.systolic_bp;
      if (payload.spo2 === '') delete payload.spo2;

      await api.postPostOpObservation(caseId, payload);
      
      // Reset form
      setScores({
        activity_score: null,
        respiration_score: null,
        circulation_score: null,
        consciousness_score: null,
        oxygenation_score: null,
      });
      setVitals({ pain_score: 0, systolic_bp: '', spo2: '', notes: '' });
      
      if (onObservationAdded) onObservationAdded();
    } catch (err) {
      console.error("Failed to save observation", err);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSubmitting(true);
      setTimeout(() => setSubmitting(false), 500);
    }
  };

  return (
    <div className="glass-card section-card" style={{ padding: '24px' }}>
      <h3 className="section-title-premium">NOUVELE ÉVALUATION (ALDRETE)</h3>
      
      <form onSubmit={handleSubmit} className="evaluation-form">
        <div className="aldrete-questions">
          {ALDRETE_CATEGORIES.map(cat => (
            <div key={cat.id} className={`form-row-scoring ${scores[cat.id] !== null ? 'has-value' : ''}`}>
              <div className="label-group">
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{cat.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {scores[cat.id] !== null 
                    ? cat.options.find(o => o.value === scores[cat.id])?.label 
                    : "Sélectionnez une valeur..."}
                </div>
              </div>
              <div className="score-options">
                {cat.options.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`score-btn ${scores[cat.id] === opt.value ? 'selected' : ''}`}
                    onClick={() => handleScoreSelect(cat.id, opt.value)}
                    title={opt.label}
                  >
                    {opt.value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '10px' }}>
          <div>
            <label className="aldrete-label">Douleur (EVA 0-10)</label>
            <input 
              type="range" min="0" max="10" 
              value={vitals.pain_score} 
              onChange={e => setVitals({...vitals, pain_score: parseInt(e.target.value)})}
              style={{ width: '100%', accentColor: '#ef4444' }}
            />
            <div style={{ textAlign: 'center', fontWeight: '800', color: vitals.pain_score > 3 ? '#ef4444' : '#10b981' }}>
              {vitals.pain_score} / 10
            </div>
          </div>
          <div>
            <label className="aldrete-label">TA Systolique</label>
            <input 
              type="number" placeholder="mmHg"
              className="premium-textarea"
              style={{ margin: 0, padding: '8px 12px', height: '40px' }}
              value={vitals.systolic_bp}
              onChange={e => setVitals({...vitals, systolic_bp: e.target.value})}
            />
          </div>
          <div>
            <label className="aldrete-label">SpO2 réelle</label>
            <input 
              type="number" placeholder="%"
              className="premium-textarea"
              style={{ margin: 0, padding: '8px 12px', height: '40px' }}
              value={vitals.spo2}
              onChange={e => setVitals({...vitals, spo2: e.target.value})}
            />
          </div>
        </div>

        <textarea 
          placeholder="Notes d'observation supplémentaires..."
          className="premium-textarea"
          rows="2"
          value={vitals.notes}
          onChange={e => setVitals({...vitals, notes: e.target.value})}
        ></textarea>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <div className="total-score-box">
             <span className="aldrete-label">Score Aldrete : </span>
             <span style={{ fontSize: '1.4rem', fontWeight: '900', color: totalScore >= 9 ? '#10b981' : '#f59e0b', marginLeft: '8px' }}>
               {totalScore} / 10
             </span>
          </div>
          <button 
            type="submit" 
            className={`perop-btn primary ${!isComplete ? 'disabled' : ''}`}
            disabled={submitting || !isComplete}
            style={{ minWidth: '180px' }}
          >
            {submitting ? 'Enregistrement...' : 'Valider l\'évaluation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AldreteEvaluation;

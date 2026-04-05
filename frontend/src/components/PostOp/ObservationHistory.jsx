import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ObservationHistory = ({ observations }) => {
  if (!observations || observations.length === 0) {
    return (
      <div className="glass-card section-card" style={{ padding: '24px' }}>
        <h3 className="section-title-premium">HISTORIQUE DES SCORES</h3>
        <p className="empty-state">Aucune observation enregistrée.</p>
      </div>
    );
  }

  const chartData = [...observations].reverse().map(obs => ({
    time: new Date(obs.observation_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    aldrete: obs.activity_score + obs.respiration_score + obs.circulation_score + obs.consciousness_score + obs.oxygenation_score,
    pain: obs.pain_score,
    spo2: obs.spo2 || 95,
  }));

  return (
    <div className="glass-card section-card" style={{ padding: '24px' }}>
      <h3 className="section-title-premium">ÉVOLUTION CLINIQUE (REPOS)</h3>
      
      <div className="chart-container" style={{ height: '220px', marginBottom: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
            <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 10]} />
            <Tooltip 
              contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
            />
            <Line type="monotone" dataKey="aldrete" name="Aldrete" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="pain" name="Douleur" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="observation-timeline">
        {observations.map(obs => {
          const score = obs.activity_score + obs.respiration_score + obs.circulation_score + obs.consciousness_score + obs.oxygenation_score;
          const time = new Date(obs.observation_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          return (
            <div key={obs.id} className="obs-card">
              <div className="obs-time">{time}</div>
              <div className="obs-meta">
                Aldrete: <span style={{ color: score >= 9 ? '#10b981' : '#f59e0b', fontWeight: '700' }}>{score}/10</span>
                <span style={{ margin: '0 8px' }}>•</span>
                EVA: <span style={{ color: obs.pain_score > 3 ? '#ef4444' : '#fff' }}>{obs.pain_score}/10</span>
              </div>
              
              <div className="aldrete-breakdown" style={{ display: 'flex', gap: '4px', margin: '8px 0' }}>
                <span className={`mini-badge score-${obs.activity_score}`} title="Activité">A:{obs.activity_score}</span>
                <span className={`mini-badge score-${obs.respiration_score}`} title="Respiration">R:{obs.respiration_score}</span>
                <span className={`mini-badge score-${obs.circulation_score}`} title="Circulation">C:{obs.circulation_score}</span>
                <span className={`mini-badge score-${obs.consciousness_score}`} title="Conscience">Co:{obs.consciousness_score}</span>
                <span className={`mini-badge score-${obs.oxygenation_score}`} title="Oxygénation">O:{obs.oxygenation_score}</span>
              </div>

              <div className="obs-score">
                 {obs.systolic_bp || '--'} <span style={{ fontSize: '0.7rem', color: '#64748b' }}>mmHg</span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .mini-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .mini-badge.score-2 { color: #10b981; border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.1); }
        .mini-badge.score-1 { color: #f59e0b; border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.1); }
        .mini-badge.score-0 { color: #ef4444; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); }
        
        .obs-card {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
      `}</style>
    </div>
  );
};

export default ObservationHistory;

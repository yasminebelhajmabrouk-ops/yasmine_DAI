import React, { useState, useMemo } from 'react';
import { api } from '../../api/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Helper to format chart data
const formatChartData = (vitals) => {
  // vitals are sorted desc by time. We need them sorted asc for the chart.
  const sorted = [...vitals].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
  
  // Group by timestamp (approximate to nearest minute if needed, but here we just grouped by exact tick for simplicity)
  // Actually, let's group by recorded_at string representation.
  const grouped = {};
  sorted.forEach(v => {
    const time = new Date(v.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', second:'2-digit' });
    if (!grouped[time]) {
      grouped[time] = { time, fullTime: v.recorded_at };
    }
    
    if (v.vital_type === 'HEART_RATE') grouped[time].hr = parseFloat(v.value);
    if (v.vital_type === 'SYSTOLIC_BP') grouped[time].sys = parseFloat(v.value);
    if (v.vital_type === 'DIASTOLIC_BP') grouped[time].dia = parseFloat(v.value);
    if (v.vital_type === 'SPO2') grouped[time].spo2 = parseFloat(v.value);
  });
  
  return Object.values(grouped);
};

const getLatestVital = (vitals, type) => {
  const v = vitals.find(x => x.vital_type === type);
  return v ? Math.round(parseFloat(v.value)) : '--';
};

const VitalsMonitor = ({ caseId, session, vitals, onVitalsUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [newVital, setNewVital] = useState({ type: 'HEART_RATE', value: '' });

  const chartData = useMemo(() => formatChartData(vitals), [vitals]);

  const latestHR = getLatestVital(vitals, 'HEART_RATE');
  const latestSys = getLatestVital(vitals, 'SYSTOLIC_BP');
  const latestDia = getLatestVital(vitals, 'DIASTOLIC_BP');
  const latestSpo2 = getLatestVital(vitals, 'SPO2');
  const latestRr = getLatestVital(vitals, 'RESPIRATORY_RATE');

  const handleAddVital = async (e) => {
    e.preventDefault();
    if (!newVital.value) return;
    
    setLoading(true);
    try {
      await api.postPerOpVital(caseId, {
        vital_type: newVital.type,
        value: newVital.value,
        recorded_at: new Date().toISOString()
      });
      setNewVital({ ...newVital, value: '' });
      onVitalsUpdated();
    } catch (err) {
      console.error('Failed to add vital', err);
    } finally {
      setLoading(false);
    }
  };

  const isSessionActive = session?.status === 'ACTIVE';

  return (
    <div className="glass-card section-card" style={{ padding: '24px' }}>
      <h3 className="section-title-premium">MONITORING DES CONSTANTES</h3>
      
      <div className="vitals-grid">
        <div className="vital-card vital-hr">
          <div className="vital-label">Fréquence Cardiaque</div>
          <div className="vital-value">{latestHR}<span className="vital-unit">bpm</span></div>
        </div>
        <div className="vital-card vital-bp">
          <div className="vital-label">Tension Artérielle</div>
          <div className="vital-value">{latestSys !== '--' ? `${latestSys}/${latestDia !== '--'?latestDia:'--'}` : '--'}<span className="vital-unit">mmHg</span></div>
        </div>
        <div className="vital-card vital-spo2">
          <div className="vital-label">SpO2</div>
          <div className="vital-value">{latestSpo2}<span className="vital-unit">%</span></div>
        </div>
        <div className="vital-card vital-rr">
          <div className="vital-label">Fréq. Respiratoire</div>
          <div className="vital-value">{latestRr}<span className="vital-unit">/min</span></div>
        </div>
      </div>

      <div className="chart-container">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickMargin={10} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} domain={[40, 200]} />
              <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" fontSize={11} domain={[80, 100]} />
              <Tooltip 
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line yAxisId="left" type="monotone" dataKey="hr" name="FC (bpm)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line yAxisId="left" type="monotone" dataKey="sys" name="TA Sys (mmHg)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="left" type="monotone" dataKey="dia" name="TA Dia (mmHg)" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="spo2" name="SpO2 (%)" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">Aucune constante enregistrée pour l'instant.</div>
        )}
      </div>

      {isSessionActive && (
        <form onSubmit={handleAddVital} className="entry-form">
          <h4 className="section-title-premium" style={{ marginBottom: '8px' }}>Saisie Manuelle</h4>
          <div className="row-inline">
            <select 
              value={newVital.type} 
              onChange={(e) => setNewVital({...newVital, type: e.target.value})}
              className="premium-textarea"
              style={{ margin: 0, height: '42px', padding: '0 12px' }}
            >
              <option value="HEART_RATE">Fréquence Cardiaque (bpm)</option>
              <option value="SYSTOLIC_BP">Tension Systolique (mmHg)</option>
              <option value="DIASTOLIC_BP">Tension Diastolique (mmHg)</option>
              <option value="SPO2">SpO2 (%)</option>
              <option value="RESPIRATORY_RATE">Fréq. Respiratoire (/min)</option>
            </select>
            <input 
              type="number" 
              placeholder="Valeur" 
              value={newVital.value}
              onChange={(e) => setNewVital({...newVital, value: e.target.value})}
              className="premium-textarea"
              style={{ margin: 0, height: '42px', padding: '0 12px', flex: '0.5' }}
              required
            />
            <button type="submit" className="perop-btn primary" disabled={loading} style={{ height: '42px', flex: '0.3' }}>
              {loading ? '...' : '+ Ajouter'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default VitalsMonitor;

import React, { useState } from 'react';
import { api } from '../../api/client';

const RiskCalculatorModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('RCRI');
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await api.calculateRiskStandalone(inputs);
      setResults(res.data);
    } catch (error) {
      console.error("Calculation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const renderInputs = () => {
    switch (activeTab) {
      case 'RCRI':
        return (
          <div className="calc-inputs-grid">
            <Checkbox label="Chirurgie à haut risque" name="high_risk_surgery" value={inputs.high_risk_surgery} onChange={handleInputChange} />
            <Checkbox label="Ischémie cardiaque" name="history_ischemic_heart_disease" value={inputs.history_ischemic_heart_disease} onChange={handleInputChange} />
            <Checkbox label="Insuffisance cardiaque" name="history_congestive_heart_failure" value={inputs.history_congestive_heart_failure} onChange={handleInputChange} />
            <Checkbox label="Maladie cérébrovasculaire" name="history_cerebrovascular_disease" value={inputs.history_cerebrovascular_disease} onChange={handleInputChange} />
            <Checkbox label="Diabète sous insuline" name="diabetes_insulin" value={inputs.diabetes_insulin} onChange={handleInputChange} />
            <Input label="Créatinine (µmol/L)" name="creatinine" type="number" value={inputs.creatinine} onChange={handleInputChange} />
          </div>
        );
      case 'STOP-BANG':
        return (
          <div className="calc-inputs-grid">
            <Checkbox label="Ronflements (Snoring)" name="snoring" value={inputs.snoring} onChange={handleInputChange} />
            <Checkbox label="Fatigue diurne (Tiredness)" name="daytime_tiredness" value={inputs.daytime_tiredness} onChange={handleInputChange} />
            <Checkbox label="Apnées observées" name="observed_apnea" value={inputs.observed_apnea} onChange={handleInputChange} />
            <Checkbox label="Hypertension Artérielle" name="hypertension" value={inputs.hypertension} onChange={handleInputChange} />
            <Input label="Poids (kg)" name="weight" type="number" value={inputs.weight} onChange={handleInputChange} />
            <Input label="Taille (cm)" name="height" type="number" value={inputs.height} onChange={handleInputChange} />
            <Input label="Âge" name="age" type="number" value={inputs.age} onChange={handleInputChange} />
            <Checkbox label="Sexe Masculin" name="male_gender" value={inputs.male_gender} onChange={handleInputChange} />
          </div>
        );
      case 'APFEL':
        return (
          <div className="calc-inputs-grid">
            <Checkbox label="Sexe Féminin" name="female_gender" value={inputs.female_gender} onChange={handleInputChange} />
            <Checkbox label="Non-fumeur" name="non_smoker" value={inputs.non_smoker} onChange={handleInputChange} />
            <Checkbox label="ATCD de NVPO / mal de transports" name="history_ponv" value={inputs.history_ponv} onChange={handleInputChange} />
            <Checkbox label="Opioïdes prévus en post-op" name="postop_opioids" value={inputs.postop_opioids} onChange={handleInputChange} />
          </div>
        );
      case 'GOLD':
        return (
          <div className="calc-inputs-grid">
            <Input label="VEMS (% prédit)" name="fev1_percent" type="number" value={inputs.fev1_percent} onChange={handleInputChange} />
            <Input label="Exacerbations / an" name="copd_exacerbations_per_year" type="number" value={inputs.copd_exacerbations_per_year} onChange={handleInputChange} />
            <Checkbox label="Hospitalisation l'année précédente" name="copd_hospitalization_last_year" value={inputs.copd_hospitalization_last_year} onChange={handleInputChange} />
            <Input label="Score mMRC (0-4)" name="mmrc_grade" type="number" value={inputs.mmrc_grade} onChange={handleInputChange} />
            <Input label="Score CAT (0-40)" name="cat_score" type="number" value={inputs.cat_score} onChange={handleInputChange} />
          </div>
        );
      case 'CHILD-PUGH':
        return (
          <div className="calc-inputs-grid">
            <Input label="Bilirubine (µmol/L)" name="bilirubin_umol_l" type="number" value={inputs.bilirubin_umol_l} onChange={handleInputChange} />
            <Input label="Albumine (g/L)" name="albumin_g_l" type="number" value={inputs.albumin_g_l} onChange={handleInputChange} />
            <Input label="INR" name="inr" type="number" value={inputs.inr} onChange={handleInputChange} />
            <Select label="Ascite" name="ascites" value={inputs.ascites} options={[{val: '', label: 'Sélectionner...'}, {val: 'absent', label: 'Absente'}, {val: 'moderate', label: 'Modérée'}, {val: 'severe', label: 'Sévère'}]} onChange={handleInputChange} />
            <Select label="Encéphalopathie" name="encephalopathy_grade" value={inputs.encephalopathy_grade} options={[{val: '', label: 'Sélectionner...'}, {val: 'absent', label: 'Absente'}, {val: 'grade_i_ii', label: 'Grade I-II'}, {val: 'severe', label: 'Grade III-IV'}]} onChange={handleInputChange} />
          </div>
        );
      case 'ARISCAT':
        return (
          <div className="calc-inputs-grid">
            <Input label="Âge" name="age" type="number" value={inputs.age} onChange={handleInputChange} />
            <Input label="SpO2 pré-op (%)" name="preop_spo2" type="number" value={inputs.preop_spo2} onChange={handleInputChange} />
            <Checkbox label="Infection respiratoire récente" name="recent_respiratory_infection" value={inputs.recent_respiratory_infection} onChange={handleInputChange} />
            <Input label="Hémoglobine (g/dL)" name="preop_hb" type="number" value={inputs.preop_hb} onChange={handleInputChange} />
            <Select label="Site chirurgical" name="surgical_incision_site" value={inputs.surgical_incision_site} options={[{val: '', label: 'Autre'}, {val: 'upper_abdominal', label: 'Abdominale supérieure'}, {val: 'thoracic', label: 'Thoracique'}]} onChange={handleInputChange} />
            <Input label="Durée (heures)" name="surgery_duration_hours" type="number" value={inputs.surgery_duration_hours} onChange={handleInputChange} />
            <Checkbox label="Chirurgie en urgence" name="urgent_surgery" value={inputs.urgent_surgery} onChange={handleInputChange} />
          </div>
        );
      case 'CHA2DS2-VASC':
        return (
          <div className="calc-inputs-grid">
            <Checkbox label="Insuffisance cardiaque" name="heart_failure" value={inputs.heart_failure} onChange={handleInputChange} />
            <Checkbox label="Hypertension" name="hypertension" value={inputs.hypertension} onChange={handleInputChange} />
            <Input label="Âge" name="age" type="number" value={inputs.age} onChange={handleInputChange} />
            <Checkbox label="Diabète" name="diabetes" value={inputs.diabetes} onChange={handleInputChange} />
            <Checkbox label="Antécédent d'AVC/AIT" name="stroke_history" value={inputs.stroke_history} onChange={handleInputChange} />
            <Checkbox label="Maladie vasculaire" name="vascular_disease" value={inputs.vascular_disease} onChange={handleInputChange} />
            <Checkbox label="Sexe Féminin" name="female_gender" value={inputs.female_gender} onChange={handleInputChange} />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="glass-card calculator-modal animate-scale-in">
        <div className="modal-header">
          <h3>Calculateur de Risque Clinique</h3>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>

        <div className="calc-tabs" style={{ flexWrap: 'wrap' }}>
          {['RCRI', 'STOP-BANG', 'APFEL', 'GOLD', 'CHILD-PUGH', 'ARISCAT', 'CHA2DS2-VASC'].map(tab => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => {setActiveTab(tab); setResults(null);}}>
              {tab}
            </button>
          ))}
        </div>

        <div className="modal-body">
          {renderInputs()}
          
          <button className={`btn btn-primary calculate-btn ${loading ? 'loading' : ''}`} onClick={calculate} disabled={loading}>
            {loading ? 'Calcul...' : 'Calculer le Risque'}
          </button>

          {results && (
            <div className="calc-results animate-fade-in">
              <div className="results-grid">
                {results.scores.filter(s => s.score_type.includes(activeTab.replace('-', '_')) || (activeTab === 'RCRI' && s.score_type === 'LEE')).map(s => (
                  <div key={s.score_type} className="result-main-card">
                    <div className="result-label">Score {activeTab}</div>
                    <div className="result-value">{s.score_value}</div>
                  </div>
                ))}
              </div>
              {results.alerts.length > 0 && (
                <div className="calc-alerts">
                  {results.alerts.map((a, i) => (
                    <div key={i} className={`alert-pill ${a.severity.toLowerCase()}`}>
                      {a.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.25);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .calculator-modal {
          width: 100%;
          max-width: 600px;
          padding: 32px;
          background: #ffffff !important;
          border: 1px solid var(--border-color) !important;
          max-height: 80vh;
          overflow-y: auto;
          border-radius: 16px !important;
          box-shadow: var(--shadow-lg) !important;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .modal-header h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .btn-close {
          background: #f4f8ff;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 1.1rem;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .btn-close:hover { background: #eef4ff; color: var(--accent-primary); }
        .calc-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 24px;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 0;
          flex-wrap: wrap;
        }
        .tab-btn {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          color: var(--text-secondary);
          padding: 8px 14px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s;
          border-radius: 4px 4px 0 0;
        }
        .tab-btn:hover { color: var(--accent-primary); background: #f4f8ff; }
        .tab-btn.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }
        .calc-inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        .input-group { display: flex; flex-direction: column; gap: 6px; }
        .input-group label { font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; }
        .input-group input, .input-group select { 
          background: #ffffff; 
          border: 1px solid var(--border-color); 
          color: var(--text-primary); 
          padding: 9px 12px; 
          border-radius: 8px;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }
        .input-group input:focus, .input-group select:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }
        .checkbox-group { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          background: #f8fbff; 
          padding: 10px 12px; 
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid var(--border-color);
          transition: all 0.2s;
        }
        .checkbox-group:hover { background: #eef4ff; border-color: rgba(91, 141, 239, 0.3); }
        .checkbox-group label { font-size: 0.85rem; color: var(--text-secondary); cursor: pointer; font-weight: 500; }
        .calculate-btn { width: 100%; padding: 14px; margin-top: 10px; }
        
        .calc-results {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }
        .results-grid { display: grid; gap: 12px; }
        .result-main-card {
          background: linear-gradient(135deg, rgba(91, 141, 239, 0.08), rgba(59, 130, 246, 0.05));
          border: 1px solid rgba(91, 141, 239, 0.2);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        .result-label { font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; font-weight: 700; }
        .result-value { font-size: 2.5rem; font-weight: 800; color: var(--text-primary); }
        .alert-pill {
          margin-top: 12px;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .alert-pill.warning { background: rgba(245, 158, 11, 0.08); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.2); }
        .alert-pill.critical { background: rgba(239, 68, 68, 0.08); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.2); }
      `}</style>
    </div>
  );
};

const Checkbox = ({ label, name, value, onChange }) => (
  <div className="checkbox-group" onClick={() => onChange(name, !value)}>
    <input type="checkbox" checked={!!value} readOnly />
    <label>{label}</label>
  </div>
);

const Input = ({ label, name, type, value, onChange }) => (
  <div className="input-group">
    <label>{label}</label>
    <input type={type} value={value || ''} onChange={(e) => onChange(name, e.target.value)} />
  </div>
);

const Select = ({ label, name, value, options, onChange }) => (
  <div className="input-group">
    <label>{label}</label>
    <select value={value || ''} onChange={(e) => onChange(name, e.target.value)}>
      {options.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
    </select>
  </div>
);

export default RiskCalculatorModal;

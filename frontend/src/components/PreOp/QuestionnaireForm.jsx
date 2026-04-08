import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import ScorePanel from './ScorePanel';
import DecisionPanel from './DecisionPanel';
import './QuestionnaireForm.css';

const QuestionnaireForm = ({ id, caseId, onSuccess }) => {
  const [formData, setFormData] = useState({
    questionnaire: null,
    questions: [],
    responses: {},
    anesthesiaCase: null
  });
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [computing, setComputing] = useState(false);

  useEffect(() => {
    initForm();
  }, [id, caseId]);

  const initForm = async () => {
    setLoading(true);
    try {
      let qId = id;
      if (!qId && caseId) {
        const newQ = await api.createQuestionnaire({
          anesthesia_case: caseId,
          language: 'fr'
        });
        qId = newQ.data.id;
      }

      const response = await api.getQuestionnaireForm(qId);
      const { questionnaire, questions, responses: existingResponses } = response.data;
      
      const responseMap = {};
      existingResponses.forEach(r => responseMap[r.question_code] = r.answer_value);

      const caseRes = await api.getCase(questionnaire.anesthesia_case);

      setFormData({ 
        questionnaire, 
        questions, 
        responses: responseMap,
        anesthesiaCase: caseRes.data
      });

      // Load existing scores
      const scoresRes = await api.getScores();
      const caseScores = scoresRes.data.filter(s => s.anesthesia_case === questionnaire.anesthesia_case);
      setScores(caseScores);

    } catch (error) {
      console.error("Clinical form initialization error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (code, value) => {
    setFormData(prev => ({
      ...prev,
      responses: { ...prev.responses, [code]: value }
    }));
  };

  const saveResponse = async (code, value) => {
    try {
      await api.createResponse({
        questionnaire: formData.questionnaire.id,
        question_code: code,
        answer_value: value.toString()
      });
    } catch (error) {
      console.error("Clinical response persistence error", error);
    }
  };

  const handleSubmitConsultation = async () => {
    setComputing(true);
    try {
      // 1. Calculate Scores automatically
      const res = await api.computeScores(formData.questionnaire.id);
      setScores(res.data.scores);
      setAlerts(res.data.alerts);

      // 2. Mark as submitted if needed
      await api.updateQuestionnaire(formData.questionnaire.id, { validation_status: 'SUBMITTED' });
      
      // Notify parent/user
      if (onSuccess) onSuccess();
      
      // Scroll to clinical results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Submission and scoring error", error);
    } finally {
      setComputing(false);
    }
  };

  if (loading) return (
    <div className="loader-full-page">
       <div className="spinner-clinic"></div>
       <p>Chargement du dossier patient...</p>
    </div>
  );

  const sections = [...new Set(formData.questions.map(q => q.section))];

  return (
    <div className="questionnaire-container animate-fade-in">
      <div className="view-header">
        <div className="header-identity">
          <h2 className="view-title">Dossier Pré-opératoire</h2>
          <div className="patient-pill">{formData.anesthesiaCase?.patient_full_name}</div>
        </div>
        <div className="status-badge">
           <span className="badge badge-violet">{formData.questionnaire.validation_status}</span>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="alerts-container animate-fade-in">
          <h4 className="card-title-mini risk-header">
             🚩 POINTS D'ATTENTION CLINIQUES
          </h4>
          {alerts.map((alert, idx) => (
            <div key={idx} className={`alert-item alert-${alert.severity.toLowerCase()}`}>
              <div className="alert-content">
                <strong>{alert.type}</strong>: {alert.message}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="form-main-layout">
        <div className="form-content-area">
          {sections.map(section => (
            <div key={section} className="form-section glass-card">
              <h3 className="section-title-form">{section.replace(/_/g, ' ')}</h3>
              <div className="questions-grid">
                {formData.questions.filter(q => q.section === section).map(q => (
                  <div key={q.id} className="question-item">
                    <div className="label-group">
                      <div className="label-fr">{q.label_fr}</div>
                      {q.label_ar && <div className="label-ar lang-ar">{q.label_ar}</div>}
                    </div>
                    
                    <div className="input-control">
                      {q.answer_type === 'BOOLEAN' && (
                        <div className="boolean-group">
                           <button 
                             className={`btn ${formData.responses[q.question_code] === 'true' ? 'btn-primary' : 'btn-secondary'}`}
                             onClick={() => { handleInputChange(q.question_code, 'true'); saveResponse(q.question_code, 'true'); }}
                           >OUI / نعم</button>
                           <button 
                             className={`btn ${formData.responses[q.question_code] === 'false' ? 'btn-primary' : 'btn-secondary'}`}
                             onClick={() => { handleInputChange(q.question_code, 'false'); saveResponse(q.question_code, 'false'); }}
                           >NON / لا</button>
                        </div>
                      )}

                      {q.answer_type === 'TEXT' && (
                        <input 
                          type="text" 
                          className="form-input"
                          placeholder="..."
                          value={formData.responses[q.question_code] || ''}
                          onChange={(e) => handleInputChange(q.question_code, e.target.value)}
                          onBlur={(e) => saveResponse(q.question_code, e.target.value)}
                        />
                      )}

                      {q.answer_type === 'NUMBER' && (
                        <input 
                          type="number" 
                          className="form-input"
                          placeholder="0"
                          value={formData.responses[q.question_code] || ''}
                          onChange={(e) => handleInputChange(q.question_code, e.target.value)}
                          onBlur={(e) => saveResponse(q.question_code, e.target.value)}
                        />
                      )}

                      {q.answer_type === 'DATE' && (
                        <input 
                          type="date" 
                          className="form-input"
                          value={formData.responses[q.question_code] || ''}
                          onChange={(e) => handleInputChange(q.question_code, e.target.value)}
                          onBlur={(e) => saveResponse(q.question_code, e.target.value)}
                        />
                      )}

                      {(q.answer_type === 'CHOICE' || q.answer_type === 'MULTI_CHOICE') && (
                        <select 
                          className="form-input"
                          value={formData.responses[q.question_code] || ''}
                          onChange={(e) => {
                            handleInputChange(q.question_code, e.target.value);
                            saveResponse(q.question_code, e.target.value);
                          }}
                        >
                          <option value="">Sélectionner... / اختر</option>
                          <option value="I">Class I / Grade 1</option>
                          <option value="II">Class II / Grade 2</option>
                          <option value="III">Class III / Grade 3</option>
                          <option value="IV">Class IV / Grade 4</option>
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="final-actions-module">
            <div className="action-card-finish glass-card">
              <h4>Conclusion Clinique</h4>
              <p>Validez les réponses pour calculer automatiquement les scores ASA, LEE et MALLAMPATI.</p>
              <button className="btn btn-primary btn-lg btn-block" onClick={handleSubmitConsultation} disabled={computing}>
                {computing ? 'Calcul des scores...' : 'Calculer les Scores & Valider'}
              </button>
            </div>
          </div>
        </div>

        <aside className="form-sidebar-area">
          <ScorePanel 
            scores={scores} 
            loading={computing} 
            onCompute={handleSubmitConsultation} 
          />
          
          <DecisionPanel 
            caseId={formData.questionnaire.anesthesia_case}
            currentDecision={formData.anesthesiaCase?.decision}
            onDecisionChange={(val) => {
              setFormData(prev => ({
                ...prev,
                anesthesiaCase: { ...prev.anesthesiaCase, decision: val }
              }));
            }}
          />

          <div className="glass-card patient-summary-card">
             <h4 className="card-title-mini">RÉSUMÉ DOSSIER</h4>
             <div className="summary-details">
                <div className="summary-row"><span className="label">Chirurgie:</span><span className="value">{(!formData.anesthesiaCase?.surgery_type || formData.anesthesiaCase.surgery_type === 'UNKNOWN') ? <em style={{ color: 'var(--text-muted)' }}>Non renseignée</em> : formData.anesthesiaCase.surgery_type.replace(/_/g, ' ').toLowerCase().replace(/^./, c => c.toUpperCase())}</span></div>
                <div className="summary-row"><span className="label">Status Case:</span><span className="value">{formData.anesthesiaCase?.status}</span></div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuestionnaireForm;

import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import ScorePanel from './ScorePanel';
import DecisionPanel from './DecisionPanel';
import DicomViewerModal from './DicomViewerModal';
import PatientTimelineModal from './PatientTimelineModal';

const CaseReviewDetail = ({ caseId, onBack, onUpdate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState("null"); // null, saving, saved
  const [isComputing, setIsComputing] = useState(false);
  const [isDicomOpen, setIsDicomOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [timelineLogs, setTimelineLogs] = useState([]);

  useEffect(() => {
    fetchCaseDetails();
  }, [caseId]);

  const fetchCaseDetails = async () => {
    setLoading(true);
    try {
      // 1. Get Case details
      const caseRes = await api.getCase(caseId);
      const caseData = caseRes.data;

      // 2. Get Patient details
      const patientRes = await api.getPatient(caseData.patient);
      
      // 3. Get Questionnaire and Form Details (to get sections and questions)
      const questionnairesRes = await api.getQuestionnaires();
      const caseQ = questionnairesRes.data.find(q => q.anesthesia_case === caseId);
      
      let formDetails = null;
      if (caseQ) {
        const formRes = await api.getQuestionnaireForm(caseQ.id);
        formDetails = formRes.data;
      }

      // 4. Get Clinical Scores
      const scoresRes = await api.getScores();
      const caseScores = scoresRes.data.filter(s => s.anesthesia_case === caseId);

      setData({
        case: caseData,
        patient: patientRes.data,
        form: formDetails,
        scores: caseScores
      });
      setNotes(caseData.decision_notes || "");
    } catch (err) {
      console.error("Error fetching case details", err);
      setError("Impossible de charger les détails du dossier.");
    } finally {
      setLoading(true);
      // Small delay for smooth transition
      setTimeout(() => setLoading(false), 300);
    }
  };

  const handleSaveNotes = async () => {
    setSaveStatus("saving");
    try {
      await api.updateCase(caseId, { decision_notes: notes });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("null"), 3000);
      onUpdate(); // Refresh dashboard
    } catch (err) {
      console.error("Failed to save notes", err);
      setSaveStatus("null");
    }
  };

  const handleComputeScores = async () => {
    if (!data?.form?.questionnaire?.id) return;
    setIsComputing(true);
    try {
      const res = await api.computeScores(data.form.questionnaire.id);
      setData(prev => ({
        ...prev,
        scores: res.data.scores
      }));
      onUpdate(); // Update main dashboard too
    } catch (err) {
      console.error("Failed to compute scores", err);
    } finally {
      setIsComputing(false);
    }
  };

  const handleOpenTimeline = async () => {
    setIsTimelineOpen(true);
    try {
      // On récupère les logs filtrés par l'ID du dossier via la méthode dédiée
      const res = await api.getCaseAuditLogs(caseId);
      setTimelineLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch timeline logs", err);
    }
  };

  if (loading) {
    return (
      <div className="pq-center">
        <div className="loader"></div>
        <p>Analyse clinique en cours...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pq-center">
        <p className="auth-error">{error || "Dossier introuvable"}</p>
        <button className="pd-btn-outline" onClick={onBack}>Retour au tableau de bord</button>
      </div>
    );
  }

  const { patient, form, scores, case: anesthesiaCase } = data;

  return (
    <div className="case-review-container animate-fade-in">
      <div className="review-header">
        <button className="btn-back-link" onClick={onBack}>
          ← Retour à la liste
        </button>
        <div className="patient-banner glass-card">
          <div className="patient-avatar-placeholder">
            {patient.first_name[0]}{patient.last_name[0]}
          </div>
          <div className="patient-main-info">
            <h2>{patient.last_name} {patient.first_name}</h2>
            <div className="patient-meta">
              <span>{patient.gender === 'male' ? 'Homme' : 'Femme'}</span>
              <span className="dot">•</span>
              <span>Né(e) le {new Date(patient.birth_date).toLocaleDateString()}</span>
              <span className="dot">•</span>
              <span className="info-badge date-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                Opération: {anesthesiaCase.scheduled_at 
                  ? new Date(anesthesiaCase.scheduled_at).toLocaleDateString() 
                  : 'À définir'}
              </span>
              <span className="dot">•</span>
              <span className="info-badge">Dossier: {anesthesiaCase.id.substring(0,8)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="review-grid">
        <div className="review-main">
          {/* Clinical Tools Section */}
          <div className="glass-card section-card">
            <h3 className="section-title-premium">OUTILS CLINIQUES</h3>
            <div className="tools-grid">
              <button className="tool-card-btn" onClick={() => setIsDicomOpen(true)}>
                <span className="tool-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </span>
                <span className="tool-label">Imagerie (DICOM)</span>
              </button>
              <button className="tool-card-btn" onClick={handleOpenTimeline}>
                <span className="tool-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    <line x1="12" y1="11" x2="12" y2="17"></line>
                    <line x1="9" y1="14" x2="15" y2="14"></line>
                  </svg>
                </span>
                <span className="tool-label">Parcours Patient</span>
              </button>
            </div>
          </div>

          {/* Scores Section */}
          <div className="glass-card section-card">
            <h3 className="section-title-premium">SYNTHÈSE DES RISQUES (IA)</h3>
            <ScorePanel 
              scores={data.scores} 
              onCompute={handleComputeScores}
              loading={isComputing}
            />
          </div>

          {/* Questionnaire Section */}
          <div className="glass-card section-card">
            <h3 className="section-title-premium">RÉPONSES AU QUESTIONNAIRE</h3>
            {!form ? (
              <p className="empty-msg">Aucun questionnaire n'a été soumis pour ce patient.</p>
            ) : (
              <div className="responses-summary">
                {/* Group responses by section */}
                {form.questions.reduce((acc, q) => {
                  const section = q.section || "Autre";
                  if (!acc[section]) acc[section] = [];
                  acc[section].push(q);
                  return acc;
                }, {} && Object.entries(form.questions.reduce((acc, q) => {
                  const section = q.section || "Autre";
                  if (!acc[section]) acc[section] = [];
                  acc[section].push(q);
                  return acc;
                }, {})).map(([section, qs]) => (
                  <div key={section} className="review-section">
                    <h4>{section}</h4>
                    <div className="q-list-review">
                      {qs.map(q => {
                        const response = form.responses.find(r => r.question_code === q.code);
                        if (!response || response.answer_value === null || response.answer_value === undefined) return null;
                        
                        let displayValue = response.answer_value;
                        if (typeof displayValue === 'boolean') displayValue = displayValue ? 'Oui' : 'Non';
                        
                        return (
                          <div key={q.code} className="q-review-item">
                            <span className="q-text">{q.text_fr}</span>
                            <span className={`q-val ${response.answer_value === true ? 'highlight-red' : ''}`}>
                              {displayValue}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )))}
              </div>
            )}
          </div>
        </div>

        <div className="review-side">
          <DecisionPanel 
            caseId={caseId} 
            currentDecision={anesthesiaCase.decision} 
            onDecisionChange={(val) => {
              // Refresh or update parent
              onUpdate();
            }} 
          />
          
          <div className="glass-card notes-card-premium" style={{ marginTop: '24px' }}>
            <div className="notes-header">
              <h4 className="section-title-premium" style={{ marginBottom: '0' }}>NOTES CLINIQUES</h4>
              {saveStatus === 'saved' && <span className="save-indicator">✓ Enregistré</span>}
              {saveStatus === 'saving' && <span className="save-indicator saving">...</span>}
            </div>
            
            <textarea 
              className="premium-textarea" 
              placeholder="Saisissez vos observations cliniques ici..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="5"
            ></textarea>
            
            <button 
              className={`btn btn-secondary btn-sm save-notes-btn ${saveStatus === 'saving' ? 'loading' : ''}`}
              onClick={handleSaveNotes}
              disabled={saveStatus === 'saving'}
            >
              Enregistrer la note
            </button>
            <p className="hint-text">Ces notes seront immédiatement partagées avec l'équipe chirurgicale.</p>
          </div>
        </div>
      </div>

      <style>{`
        .case-review-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }
        .patient-header h2 { font-size: 1.4rem; margin-bottom: 2px; font-weight: 700; color: #fff; }
        .patient-info-row { display: flex; gap: 16px; color: #94a3b8; font-size: 0.8rem; align-items: center; }
        .case-id-tag { 
          background: rgba(59, 130, 246, 0.1); 
          color: #60a5fa; 
          padding: 2px 10px; 
          border-radius: 4px; 
          font-family: monospace;
          font-size: 0.75rem;
        }
        
        .section-title-premium {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #475569;
          text-transform: uppercase;
          margin-bottom: 16px;
          display: block;
        }
        .review-header {
          margin-bottom: 24px;
        }
        .btn-back-link {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          font-weight: 600;
          margin-bottom: 16px;
          display: block;
        }
        .patient-banner {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 20px 32px;
        }
        .patient-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.85rem;
          color: #94a3b8;
          margin-top: 4px;
        }
        .dot { color: #334155; }
        
        .review-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .review-grid { grid-template-columns: 1fr; }
        }

        .section-card {
          margin-bottom: 24px;
        }

        .review-section {
          margin-bottom: 24px;
        }
        .review-section h4 {
          color: #3b82f6;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #1e293b;
        }

        .q-list-review {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .q-review-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          font-size: 0.9rem;
          padding: 6px 0;
        }
        .q-text { color: #94a3b8; flex: 1; padding-right: 20px; }
        .q-val { color: #fff; font-weight: 600; text-align: right; }
        .highlight-red { color: #f87171; }

        .card-title-mini {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }
        .hint-text {
          font-size: 0.7rem;
          color: #475569;
          margin-top: 8px;
        }
        .premium-textarea {
          width: 100%;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          color: #fff;
          padding: 14px;
          font-size: 0.9rem;
          line-height: 1.5;
          resize: vertical;
          margin-bottom: 12px;
          transition: all 0.2s;
        }
        .premium-textarea:focus {
          outline: none;
          background: rgba(0,0,0,0.3);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .notes-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .save-indicator { font-size: 0.7rem; color: #10b981; font-weight: 700; }
        .save-indicator.saving { color: #3b82f6; animation: pulse 1s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        
        .save-notes-btn { width: 100%; margin-top: 4px; }
        .empty-msg { color: #475569; font-style: italic; }
      `}</style>
    </div>
  );
};

export default CaseReviewDetail;

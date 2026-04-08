import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import ScorePanel from './ScorePanel';
import DecisionPanel from './DecisionPanel';
import PatientTimelineModal from './PatientTimelineModal';
import PerOpDashboard from '../PerOp/PerOpDashboard';
import PostOpDashboard from '../PostOp/PostOpDashboard';
import SignaturePad from '../Common/SignaturePad';
import { useAuth } from '../../context/AuthContext';

const CaseReviewDetail = ({ caseId, onBack, onUpdate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState("null"); // null, saving, saved
  const [isComputing, setIsComputing] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [timelineLogs, setTimelineLogs] = useState([]);
  const [isPerOpMode, setIsPerOpMode] = useState(false);
  const [isPostOpMode, setIsPostOpMode] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState("");
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const { user } = useAuth();

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

  const handleFinalizeCase = async () => {
    if (!signatureData) {
      alert("Veuillez apposer votre signature avant de clôturer.");
      return;
    }

    setSaveStatus("saving");
    try {
      const timestamp = new Date().toLocaleString('fr-FR');
      const digitalSeal = `\n\n--- VALIDATION MÉDICALE ---\nSigné numériquement par : Dr. ${user?.last_name || 'Anesthésiste'}\nDate : ${timestamp}\nAuthentification : Certifiée (Système DAI)\n----------------------------`;

      const updatedNotes = notes + digitalSeal;

      await api.updateCase(caseId, {
        status: 'CLOSED',
        decision_notes: updatedNotes
      });

      setIsSignatureModalOpen(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("null"), 3000);
      fetchCaseDetails(); // Refresh to lock UI
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Failed to finalize case", err);
      alert("Erreur lors de la clôture du dossier.");
    } finally {
      setSaveStatus("null");
    }
  };

  const handleUpdateDate = async () => {
    if (!tempDate) return;
    try {
      // On met à jour le backend avec la nouvelle date
      await api.updateCase(caseId, { scheduled_at: tempDate });
      setIsEditingDate(false);
      fetchCaseDetails(); // Recharger pour voir le changement
      if (onUpdate) onUpdate(); // Rafraîchir le tableau de bord parent
    } catch (err) {
      console.error("Failed to update date", err);
      alert("Erreur lors de la mise à jour de la date.");
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

  if (isPerOpMode) {
    return (
      <PerOpDashboard
        caseId={caseId}
        patientData={patient}
        onBack={() => {
          setIsPerOpMode(false);
          fetchCaseDetails(); // Refresh the case details when coming back
        }}
      />
    );
  }

  if (isPostOpMode) {
    return (
      <PostOpDashboard
        caseId={caseId}
        patientData={patient}
        onBack={() => {
          setIsPostOpMode(false);
          fetchCaseDetails();
        }}
      />
    );
  }

  return (
    <div className="case-review-container">
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
              {isEditingDate ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="date"
                    className="premium-date-input"
                    value={tempDate}
                    onChange={(e) => setTempDate(e.target.value)}
                  />
                  <button className="btn-save-mini" onClick={handleUpdateDate}>✓</button>
                  <button className="btn-cancel-mini" onClick={() => setIsEditingDate(false)}>✕</button>
                </div>
              ) : (
                <button
                  className="info-badge date-badge-btn"
                  onClick={() => {
                    setIsEditingDate(true);
                    setTempDate(anesthesiaCase.scheduled_at ? anesthesiaCase.scheduled_at.split('T')[0] : "");
                  }}
                  title="Planifier l'intervention"
                >
                  <span className="cal-icon">📅</span>
                  Opération: {anesthesiaCase.scheduled_at
                    ? new Date(anesthesiaCase.scheduled_at).toLocaleDateString()
                    : 'Non planifiée (Cliquer pour définir)'}
                </button>
              )}
              <span className="dot">•</span>
              <span className="info-badge">Dossier: {anesthesiaCase.id.substring(0, 8)}</span>
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

              <button
                className="tool-card-btn"
                onClick={() => setIsPerOpMode(true)}
                style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.2))', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              >
                <span className="tool-icon" style={{ color: '#10b981' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </span>
                <span className="tool-label" style={{ color: '#10b981' }}>Entrer en Salle (Per-Op)</span>
              </button>

              <button
                className="tool-card-btn"
                onClick={() => setIsPostOpMode(true)}
                style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.2))', border: '1px solid rgba(59, 130, 246, 0.3)' }}
              >
                <span className="tool-icon" style={{ color: '#3b82f6' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </span>
                <span className="tool-label" style={{ color: '#3b82f6' }}>Salle de Réveil (Post-Op)</span>
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
                {Object.entries(form.questions.reduce((acc, q) => {
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
                ))}
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
              disabled={saveStatus === 'saving' || anesthesiaCase.status === 'CLOSED'}
            >
              Enregistrer la note
            </button>

            {anesthesiaCase.status !== 'CLOSED' ? (
              <button
                className="btn btn-primary btn-sm"
                style={{ width: '100%', marginTop: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
                onClick={() => setIsSignatureModalOpen(true)}
              >
                Signer & Clôturer le Dossier
              </button>
            ) : (
              <div className="signature-seal-badge" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                🛡️ Dossier Scellé Numériquement
              </div>
            )}

            <p className="hint-text">Ces notes seront immédiatement partagées avec l'équipe chirurgicale.</p>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {isSignatureModalOpen && (
        <div className="dicom-modal-overlay">
          <div className="timeline-modal-content" style={{ maxWidth: '550px' }}>
            <div className="timeline-modal-header">
              <h3 className="feed-title-blue">Validation et Signature</h3>
              <button className="btn-close-modal" onClick={() => setIsSignatureModalOpen(false)}>✕</button>
            </div>
            <div className="timeline-body" style={{ padding: '24px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                En signant ce dossier, vous confirmez que l'évaluation pré-opératoire est complète et que la décision d'anesthésie est validée.
                <strong> Cette action est irréversible et clôturera le dossier.</strong>
              </p>

              <SignaturePad onSign={(data) => setSignatureData(data)} />
            </div>
            <div className="timeline-footer" style={{ gap: '16px' }}>
              <button className="btn btn-secondary" onClick={() => setIsSignatureModalOpen(false)}>Annuler</button>
              <button
                className="btn btn-primary"
                onClick={handleFinalizeCase}
                disabled={!signatureData || saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? 'Clôture en cours...' : 'Confirmer et Clôturer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .case-review-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }
        .patient-header h2 { font-size: 1.4rem; margin-bottom: 2px; font-weight: 700; color: var(--text-primary); }
        .patient-info-row { display: flex; gap: 16px; color: var(--text-secondary); font-size: 0.8rem; align-items: center; }
        .case-id-tag { 
          background: rgba(91, 141, 239, 0.1); 
          color: var(--accent-primary); 
          padding: 2px 10px; 
          border-radius: 4px; 
          font-family: monospace;
          font-size: 0.75rem;
        }
        
        .section-title-premium {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          text-transform: uppercase;
          margin-bottom: 16px;
          display: block;
        }
        .review-header {
          margin-bottom: 24px;
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
          color: var(--text-secondary);
          margin-top: 4px;
          flex-wrap: wrap;
        }
        .dot { color: var(--border-color); }
        
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
          color: var(--accent-primary);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
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
        .q-text { color: var(--text-secondary); flex: 1; padding-right: 20px; }
        .q-val { color: var(--text-primary); font-weight: 600; text-align: right; }
        .highlight-red { color: #dc2626; }

        .card-title-mini {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }
        .hint-text {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 8px;
        }
        .premium-textarea {
          width: 100%;
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          padding: 14px;
          font-size: 0.9rem;
          line-height: 1.5;
          resize: vertical;
          margin-bottom: 12px;
          transition: all 0.2s;
        }
        .premium-textarea::placeholder { color: var(--text-muted); }
        .premium-textarea:focus {
          outline: none;
          background: #ffffff;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 4px var(--accent-glow);
        }
        .notes-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .save-indicator { font-size: 0.7rem; color: #059669; font-weight: 700; }
        .save-indicator.saving { color: var(--accent-primary); animation: pulse 1s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        
        .save-notes-btn { width: 100%; margin-top: 4px; }
        .empty-msg { color: var(--text-muted); font-style: italic; }
      `}</style>

      <style>{`
        .date-badge-btn {
          background: rgba(16, 185, 129, 0.08);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.2);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .date-badge-btn:hover {
          background: rgba(16, 185, 129, 0.15);
          transform: translateY(-1px);
        }
        .cal-icon { font-size: 0.9rem; }
        
        .premium-date-input {
          background: #ffffff;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.8rem;
          outline: none;
        }
        .btn-save-mini {
          background: #ffffff;
          border: 1px solid var(--border-color);
          color: #059669;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .btn-cancel-mini {
          background: #ffffff;
          border: 1px solid var(--border-color);
          color: #dc2626;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .btn-save-mini:hover { background: #059669; color: #ffffff; border-color: #059669; }
        .btn-cancel-mini:hover { background: #dc2626; color: #ffffff; border-color: #dc2626; }

      `}</style>

      {isTimelineOpen && (
        <PatientTimelineModal isOpen={isTimelineOpen} logs={timelineLogs} patientName={`${patient.first_name} ${patient.last_name}`} onClose={() => setIsTimelineOpen(false)} />
      )}
    </div>
  );
};

export default CaseReviewDetail;

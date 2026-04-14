import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import ActivityFeed from './ActivityFeed';
import CaseReviewDetail from '../PreOp/CaseReviewDetail';
import RiskCalculatorModal from '../PreOp/RiskCalculatorModal';
import TemplateManager from '../Admin/TemplateManager';
import AuditViewer from '../Admin/AuditViewer';
import UserProfile from './UserProfile';
import './Dashboard.css';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ patients: 0, cases: 0, questionnaires: 0, scores: 0 });
  const [cases, setCases] = useState([]);
  const [patients, setPatients] = useState({}); // Map for quick lookup
  const [questionnaires, setQuestionnaires] = useState({}); // Map caseId -> questionnaire
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const [isAuditMode, setIsAuditMode] = useState(false);
  const [isProfileMode, setIsProfileMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientsRes, casesRes, questionnairesRes, scoresRes, auditLogs] = await Promise.all([
        api.getPatients(),
        api.getCases(),
        api.getQuestionnaires(),
        api.getScores(),
        api.getAuditLogs()
      ]);

      setStats({
        patients: patientsRes.data.length,
        cases: casesRes.data.length,
        questionnaires: questionnairesRes.data.length,
        scores: scoresRes.data.length
      });

      // Create lookup maps
      const pMap = {};
      patientsRes.data.forEach(p => pMap[p.id] = p);
      setPatients(pMap);

      const qMap = {};
      questionnairesRes.data.forEach(q => qMap[q.anesthesia_case] = q);
      setQuestionnaires(qMap);

      setCases(casesRes.data);
      setLogs(auditLogs.data.slice(0, 10));

      // 4. Compute Notifications (High risk alert)
      const alerts = casesRes.data.filter(c => {
        const caseScores = scoresRes.data.filter(s => s.anesthesia_case === c.id);
        const asaScore = caseScores.find(s => s.score_type === 'ASA');
        return asaScore && parseInt(asaScore.score_value) >= 3;
      }).map(c => ({
        id: c.id,
        type: 'CRITICAL_RISK',
        message: `Risque élevé détecté pour ${pMap[c.patient]?.first_name || 'Patient'}`,
        caseId: c.id,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setNotifications(alerts);

    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
    } finally {
      setLoading(false);
    }
  };

  const formatSurgeryType = (val) => {
    if (!val || val === 'UNKNOWN') return <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Non renseignée</span>;
    return val.replace(/_/g, ' ').toLowerCase().replace(/^./, c => c.toUpperCase());
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PRE_OP': return <span className="badge badge-amber">Pré-op</span>;
      case 'PER_OP': return <span className="badge badge-blue">Bloc</span>;
      case 'POST_OP': return <span className="badge badge-emerald">Post-op</span>;
      default: return <span className="badge badge-gray">{status}</span>;
    }
  };

  const getDecisionBadge = (decision) => {
    switch (decision) {
      case 'AUTHORIZED': return <span className="badge badge-emerald">Autorisé</span>;
      case 'EXAMS_REQUIRED': return <span className="badge badge-amber">Examens</span>;
      case 'SPECIALIST_OPINION': return <span className="badge badge-blue">Avis Spé.</span>;
      case 'REFUSED': return <span className="badge badge-rose">Refusé</span>;
      default: return <span className="badge badge-gray">En attente</span>;
    }
  };

  const filteredCases = cases.filter(c => {
    const p = patients[c.patient] || {};
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    const searchLow = searchTerm.toLowerCase();
    return fullName.includes(searchLow) || c.id.toLowerCase().includes(searchLow);
  });

  if (loading && !selectedCaseId) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Chargement de l'espace médical...</p>
      </div>
    );
  }

  // Case Detail View
  if (selectedCaseId) {
    return (
      <div className="dashboard-content premium-theme">
        <CaseReviewDetail
          caseId={selectedCaseId}
          onBack={() => setSelectedCaseId(null)}
          onUpdate={fetchData}
        />
      </div>
    );
  }

  if (isTemplateMode) {
    return (
      <div className="dashboard-content premium-theme animate-fade-in">
        <TemplateManager onBack={() => setIsTemplateMode(false)} />
      </div>
    );
  }

  // Audit Viewer View
  if (isAuditMode) {
    return (
      <div className="dashboard-content premium-theme animate-fade-in">
        <AuditViewer onBack={() => setIsAuditMode(false)} />
      </div>
    );
  }

  // User Profile View
  if (isProfileMode) {
    return (
      <div className="dashboard-content premium-theme animate-fade-in">
        <UserProfile onBack={() => setIsProfileMode(false)} />
      </div>
    );
  }

  return (
    <div className="dashboard-content premium-theme animate-fade-in">
      <div className="dashboard-main-container">
        <div className="dashboard-header">
          {/* Titre à gauche sur tout l'espace */}
          <div className="header-center-block">
            <h2>Tableau de Bord Médical</h2>
            <p>Bonjour, Dr. {user?.first_name || user?.last_name || 'Anesthésiste'}. Voici vos dossiers patients.</p>
          </div>
          <div className="header-right">
            <button className="btn-profile-premium" onClick={() => setIsProfileMode(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Mon Profil</span>
            </button>

            <button className="btn-logout-blue" onClick={logout} title="Déconnexion">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Déconnexion</span>
            </button>

            <div className="notification-bell" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <span className="bell-icon">🔔</span>
              {notifications.length > 0 && (
                <span className="notif-badge notif-badge-blue">{notifications.length}</span>
              )}
              {isNotifOpen && (
                <div className="notif-dropdown glass-card">
                  <div className="notif-header">Alertes Cliniques</div>
                  {notifications.length === 0 ? (
                    <div className="notif-empty">Aucune alerte active</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="notif-item" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCaseId(n.caseId);
                        setIsNotifOpen(false);
                      }}>
                        <div className="id-notif-type-blue">ALERTE</div>
                        <div className="notif-msg">{n.message}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-grid-top">
          <StatCard title="Patients" value={stats.patients} color="cyan" />
          <StatCard title="Dossiers" value={stats.cases} color="violet" />
          <StatCard title="Bilans" value={stats.questionnaires} color="amber" />
          <StatCard title="Analyses IA" value={stats.scores} color="emerald" />
        </div>

        <div className="dashboard-main-grid">
          <div className="glass-card cases-section">
            <div className="section-title">
              <h3 className="feed-title-blue">Liste des Dossiers Actifs</h3>
              <div className="search-box-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Chercher un patient ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-ghost btn-sm" onClick={fetchData}>Actualiser</button>
            </div>

            <div className="case-review-container">
              <table className="case-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Chirurgie</th>
                    <th>Date Prévue</th>
                    <th>Étape</th>
                    <th>Décision</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map(c => {
                    const patient = patients[c.patient] || { first_name: 'Inconnu', last_name: '' };
                    const surgeryDate = c.scheduled_at
                      ? new Date(c.scheduled_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                      : 'Non planifiée';

                    return (
                      <tr key={c.id}>
                        <td>
                          <div className="patient-name-cell">
                            <span className="name">{patient.first_name} {patient.last_name}</span>
                            <span className="id">ID: {c.id.substring(0, 8)}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.875rem' }}>{formatSurgeryType(c.surgery_type)}</td>
                        <td><span className="date-cell">{surgeryDate}</span></td>
                        <td>{getStatusBadge(c.status)}</td>
                        <td>{getDecisionBadge(c.decision)}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setSelectedCaseId(c.id)}
                          >
                            Réviser
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {cases.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                        Aucun dossier actif trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid-col-1">
            <div className="glass-card quick-actions">
              <h3 className="section-title">Outils Cliniques</h3>
              <div className="actions-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => setIsCalcModalOpen(true)}
                >
                  Calculateur de Risque
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', border: '1px solid currentColor', marginTop: '8px' }}
                  onClick={() => setIsTemplateMode(true)}
                >
                  Configuration Questionnaire
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', border: '1px solid #64748b', marginTop: '8px', color: '#94a3b8' }}
                  onClick={() => setIsAuditMode(true)}
                >
                  Log d'Audit Système
                </button>
              </div>
            </div>
          </div>
        </div>

        <RiskCalculatorModal
          isOpen={isCalcModalOpen}
          onClose={() => setIsCalcModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default DoctorDashboard;

import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import StatCard from './StatCard';
import ActivityFeed from './ActivityFeed';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    cases: 0,
    questionnaires: 0,
    scores: 0
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patients, cases, questionnaires, scores, auditLogs] = await Promise.all([
          api.getPatients(),
          api.getCases(),
          api.getQuestionnaires(),
          api.getScores(),
          api.getAuditLogs()
        ]);

        setStats({
          patients: patients.data.length,
          cases: cases.data.length,
          questionnaires: questionnaires.data.length,
          scores: scores.data.length
        });

        // Limit to latest 10 logs
        setLogs(auditLogs.data.slice(0, 10));
      } catch (error) {
        console.error("Erreur lors de la récupération des données du dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Chargement du dossier intelligent...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content animate-fade-in">
      <div className="dashboard-grid-top">
        <StatCard 
          title="Patients Totaux" 
          value={stats.patients} 
          icon="👥" 
          color="cyan"
          trend="up"
          trendValue="12%"
        />
        <StatCard 
          title="Cas Anesthésie" 
          value={stats.cases} 
          icon="🏥" 
          color="violet"
          trend="up"
          trendValue="8%"
        />
        <StatCard 
          title="Questionnaires" 
          value={stats.questionnaires} 
          icon="📋" 
          color="amber"
          trend="down"
          trendValue="2%"
        />
        <StatCard 
          title="Scores Cliniques" 
          value={stats.scores} 
          icon="⚡" 
          color="emerald"
        />
      </div>

      <div className="dashboard-main-grid">
        <div className="grid-col-2">
          <ActivityFeed logs={logs} />
        </div>
        <div className="grid-col-1">
          <div className="glass-card status-overview">
             <h3 className="section-title">État des Cas</h3>
             <div className="status-list">
               <div className="status-item">
                 <div className="status-label">Pré-opératoire</div>
                 <div className="status-bar-container">
                   <div className="status-bar" style={{ width: '45%', background: 'var(--accent-amber)' }}></div>
                 </div>
                 <div className="status-count">45%</div>
               </div>
               <div className="status-item">
                 <div className="status-label">Bloc (Per-op)</div>
                 <div className="status-bar-container">
                   <div className="status-bar" style={{ width: '30%', background: 'var(--accent-cyan)' }}></div>
                 </div>
                 <div className="status-count">30%</div>
               </div>
               <div className="status-item">
                 <div className="status-label">SSPI (Post-op)</div>
                 <div className="status-bar-container">
                   <div className="status-bar" style={{ width: '25%', background: 'var(--accent-emerald)' }}></div>
                 </div>
                 <div className="status-count">25%</div>
               </div>
             </div>
          </div>
          
          <div className="glass-card quick-actions">
            <h3 className="section-title">Actions Rapides</h3>
            <div className="actions-buttons">
              <button className="btn btn-secondary btn-sm">Scanner Dossier</button>
              <button className="btn btn-secondary btn-sm">Exporter Bilans</button>
              <button className="btn btn-secondary btn-sm">Paramètres Scoring</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

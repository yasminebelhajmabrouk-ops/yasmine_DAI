import React from 'react';
import './Dashboard.css';

const ActivityFeed = ({ logs }) => {
    const formatAction = (action) => {
    const map = {
      'CREATE': 'Création de',
      'UPDATE': 'Mise à jour de',
      'DELETE': 'Suppression de',
      'COMPUTE_SCORES': 'Calcul des scores',
      'LOGIN': 'Connexion',
      'LOGOUT': 'Déconnexion',
    };
    // If it starts with CREATE, we can split it
    if (action.startsWith('CREATE')) return 'Création';
    if (action.startsWith('UPDATE')) return 'Mise à jour';
    return map[action] || action;
  };

  const formatEntity = (entity) => {
    const map = {
      'AnesthesiaCase': 'Dossier',
      'Patient': 'Patient',
      'PreOpQuestionnaire': 'Questionnaire',
      'PreOpQuestionnaireResponse': 'Réponse',
      'ClinicalScore': 'Score clinique',
    };
    return map[entity] || entity;
  };

  return (
    <div className="activity-feed glass-card">
      <div className="feed-header">
        <h3 className="feed-title">Journal d'Activité</h3>
        <button className="btn btn-ghost btn-sm">Tout voir</button>
      </div>
      <div className="feed-list">
        {logs && logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={log.id} className={`feed-item animate-fade-in-up`} style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="feed-marker"></div>
              <div className="feed-content">
                <div className="feed-main">
                  <span className="feed-action">{formatAction(log.action)}</span>
                  <span className="feed-entity-sep">{formatAction(log.action).includes('scores') ? '' : '—'}</span>
                  <span className="feed-entity">{formatEntity(log.entity_type)}</span>
                </div>
                <div className="feed-meta">
                  <span className="feed-actor">{log.actor || 'Système'}</span>
                  <span className="feed-time">{new Date(log.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <div className="empty-state-title">Aucune activité</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;

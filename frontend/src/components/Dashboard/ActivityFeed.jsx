import React from 'react';
import './Dashboard.css';

const ActivityFeed = ({ logs }) => {
  const formatAction = (action) => {
    const map = {
      'UPDATE': 'Mise à jour',
      'CREATE': 'Création',
      'END_POSTOP_STAY': 'Fin de surveillance',
      'START_POSTOP_STAY': 'Admission Réveil',
      'CREATE_POSTOP_OBSERVATION': 'Observation Post-Op',
      'RESOLVE_ALERT': 'Alerte résolue',
      'END_PEROP_SESSION': 'Fin d\'anesthésie',
      'CREATE_PEROP_EVENT': 'Événement consigné',
      'START_PEROP_SESSION': 'Début anesthésie',
      'LOGIN': 'Connexion',
      'LOGOUT': 'Déconnexion',
      'COMPUTE_SCORES': 'Calcul des scores',
      'ACKNOWLEDGE_ALERT': 'Alerte acquittée',
      'CREATE_VITAL_MEASUREMENT': 'Signes vitaux',
    };
    return map[action] || action;
  };

  const formatEntity = (entity) => {
    const map = {
      'AnesthesiaCase': 'Dossier',
      'PostOpStay': 'S.S.P.I',
      'PostOpObservation': 'Observations',
      'Alert': 'Alerte',
      'PerOpSession': 'Session Per-Op',
      'PerOpEvent': 'Événement',
      'Patient': 'Patient',
      'VitalSignMeasurement': 'Monitorage',
    };
    return map[entity] || entity;
  };

  return (
    <div className="activity-feed glass-card">
      <div className="feed-header">
        <h3 className="feed-title-blue">Journal d'Activité</h3>
        <button className="btn btn-ghost btn-sm">Tout voir</button>
      </div>
      <div className="feed-list">
        {logs && logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={log.id} className="feed-item-raw animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="feed-body-raw">
                <div className="feed-header-raw">
                  <span className="raw-action">{formatAction(log.action)}</span>
                  <span className="raw-sep">—</span>
                  <span className="raw-entity">{formatEntity(log.entity_type)}</span>
                </div>
                <div className="feed-footer-raw">
                  <span className="raw-actor">{log.actor || 'Système'}</span>
                  <span className="raw-time">{new Date(log.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-title">Aucune activité enregistrée</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;

import React, { useState } from 'react';
import { api } from '../../api/client';

const EventTimeline = ({ caseId, session, events, onEventsUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    event_type: 'MEDICATION',
    title: '',
    description: ''
  });

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title) return;

    setLoading(true);
    try {
      const et = newEvent.event_type;
      let prefix = "";

      if (et === 'MEDICATION') prefix = " Admin: ";
      else if (et === 'INCIDENT') prefix = " Incident: ";
      else if (et === 'PROCEDURE') prefix = " Geste: ";
      else if (et === 'TECHNICAL') prefix = " Tech: ";

      const payload = {
        event_type: 'PROCEDURE',
        title: `${prefix}${newEvent.title}`,
        description: newEvent.description,
        timestamp: new Date().toISOString()
      };

      await api.postPerOpEvent(caseId, payload);
      setNewEvent({ ...newEvent, title: '', description: '' });
      onEventsUpdated();
    } catch (err) {
      console.error('Failed to add event', err);
      const errDetail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      alert("Erreur lors de l'enregistrement de l'évènement : " + errDetail);
    } finally {
      setLoading(false);
    }
  };

  const isSessionActive = session?.status === 'ACTIVE';

  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="glass-card section-card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 className="section-title-premium">JOURNAL CHIRURGICAL</h3>

      <div className="perop-timeline" style={{ flex: 1 }}>
        {events.length > 0 ? (
          events.map(ev => (
            <div key={ev.id} className={`timeline-event-card ${ev.event_type}`}>
              <div className="event-time">{formatTime(ev.timestamp)}</div>
              <div className="event-title">{ev.title}</div>
              {ev.description && <div className="event-desc">{ev.description}</div>}
              {ev.event_type === 'MEDICATION' && (
                <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#10b981' }}>
                  Administration
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">Aucun évènement enregistré.</div>
        )}
      </div>

      {isSessionActive && (
        <form onSubmit={handleAddEvent} className="entry-form-surgical" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="row-inline" style={{ display: 'flex', gap: '8px' }}>
            <select
              value={newEvent.event_type}
              onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
              className="premium-textarea"
              style={{ margin: 0, height: '42px', padding: '0 12px', flex: '0.4', fontSize: '0.85rem', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
            >
              <option value="MEDICATION"> Médicament</option>
              <option value="PROCEDURE"> Geste Technique</option>
              <option value="INCIDENT"> Incident</option>
              <option value="TECHNICAL"> Autre (Technique)</option>
            </select>
            <input
              type="text"
              placeholder="Action ou note..."
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="premium-textarea"
              style={{ margin: 0, height: '42px', padding: '0 12px', flex: '1', fontSize: '0.9rem', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
              required
            />
          </div>
          <button type="submit" className="perop-btn primary" disabled={loading} style={{ width: '100%', height: '42px', borderRadius: '8px' }}>
            {loading ? 'Enregistrement...' : 'Consigner l\'évènement'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EventTimeline;

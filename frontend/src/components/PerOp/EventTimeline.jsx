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
      const payload = {
        event_type: newEvent.event_type,
        title: newEvent.title,
        description: newEvent.description,
        timestamp: new Date().toISOString()
      };

      if (newEvent.event_type === 'MEDICATION') {
        const parts = newEvent.title.split(' ');
        payload.medication_administration = {
          drug_name: parts[0] || 'Unknown Drug',
          dose: parts.slice(1).join(' ') || 'Standard Dose',
          administered_at: new Date().toISOString()
        };
      }

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
                  💊 Administration
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">Aucun évènement enregistré.</div>
        )}
      </div>

      {isSessionActive && (
        <form onSubmit={handleAddEvent} className="entry-form" style={{ marginTop: 'auto' }}>
          <div className="row-inline">
            <select 
              value={newEvent.event_type}
              onChange={(e) => setNewEvent({...newEvent, event_type: e.target.value})}
              className="premium-textarea"
              style={{ margin: 0, height: '42px', padding: '0 12px', flex: '0.4' }}
            >
              <option value="MEDICATION">Médicament</option>
              <option value="PROCEDURE">Geste Technique</option>
              <option value="INCIDENT">Incident</option>
              <option value="TECHNICAL">Autre (Tech)</option>
            </select>
            <input 
              type="text" 
              placeholder="Action (ex: Propofol 200mg)" 
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              className="premium-textarea"
              style={{ margin: 0, height: '42px', padding: '0 12px', flex: '1' }}
              required
            />
          </div>
          <button type="submit" className="perop-btn primary" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Consigner l\'évènement'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EventTimeline;

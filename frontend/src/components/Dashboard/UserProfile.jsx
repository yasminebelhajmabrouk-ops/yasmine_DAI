import React, { useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const UserProfile = ({ onBack }) => {
  const { user, login } = useAuth(); // We'll use login(token) or a refresh method if available
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    specialty: user?.specialty || '',
    license_number: user?.license_number || '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const updateData = { ...formData };
      if (!updateData.password) delete updateData.password;
      
      await api.updateMe(updateData);
      
      // Update local storage/context with new user data
      // Note: In a real app, you might want to fetch /me again or update context directly
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      
      // Refresh user data (if the auth context supports it)
      // For now, the user can refresh the page or we can try to update context manually
    } catch (err) {
      console.error("Failed to update profile", err);
      const detail = err.response?.data ? JSON.stringify(err.response.data) : "Erreur inconnue";
      setMessage({ type: 'error', text: `Erreur : ${detail}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container animate-fade-in">
      <header className="admin-header">
        <div>
          <button className="btn-back-link" onClick={onBack}>← Retour au Tableau de Bord</button>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginTop: '8px' }}>
            Mon Profil Professionnel
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>
            Gérez vos informations d'identité et vos paramètres de sécurité.
          </p>
        </div>
      </header>

      <div className="dashboard-main-grid" style={{ gridTemplateColumns: '1fr 350px' }}>
        <div className="glass-card">
          <h3 className="section-title">Modifier mes informations</h3>
          
          {message && (
            <div className={`notification-banner ${message.type}`} style={{ marginBottom: '20px', padding: '12px', borderRadius: '8px', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444' }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label className="admin-label">Prénom</label>
                <input 
                  className="admin-input" 
                  value={formData.first_name}
                  onChange={e => setFormData({...formData, first_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="admin-label">Nom</label>
                <input 
                  className="admin-input" 
                  value={formData.last_name}
                  onChange={e => setFormData({...formData, last_name: e.target.value})}
                  required
                />
              </div>
              <div className="full-width">
                <label className="admin-label">Email (Identifiant technique)</label>
                <input 
                  className="admin-input" 
                  value={formData.email}
                  disabled
                />
              </div>
              <div>
                <label className="admin-label">Spécialité</label>
                <input 
                  className="admin-input" 
                  placeholder="Ex: Anesthésiste-Réanimateur"
                  value={formData.specialty}
                  onChange={e => setFormData({...formData, specialty: e.target.value})}
                />
              </div>
              <div>
                <label className="admin-label">Numéro RPPS / Licence</label>
                <input 
                  className="admin-input" 
                  placeholder="Ex: 10123456789"
                  value={formData.license_number}
                  onChange={e => setFormData({...formData, license_number: e.target.value})}
                />
              </div>
              <div className="full-width" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', marginTop: '12px' }}>
                <h4 style={{ color: '#fff', marginBottom: '16px' }}>Sécurité</h4>
                <label className="admin-label">Nouveau Mot de Passe (Laisser vide pour ne pas changer)</label>
                <input 
                  type="password"
                  className="admin-input" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="perop-btn primary" 
              style={{ padding: '12px 32px', marginTop: '20px' }}
              disabled={loading}
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </button>
          </form>
        </div>

        <aside className="profile-sidebar">
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div className="profile-avatar-large" style={{ 
              width: '100px', 
              height: '100px', 
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              color: 'white',
              boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.4)'
            }}>
              {user?.first_name?.[0] || user?.username?.[0]}
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.4rem' }}>
              Dr. {user?.first_name} {user?.last_name}
            </h2>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
              {user?.specialty || 'Spécialité non définie'}
            </div>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '24px', paddingTop: '24px', textAlign: 'left' }}>
              <div className="admin-label" style={{ fontSize: '0.65rem' }}>Rôle Système</div>
              <div style={{ color: '#60a5fa', fontWeight: '700' }}>{user?.role}</div>
              
              <div className="admin-label" style={{ fontSize: '0.65rem', marginTop: '16px' }}>Identifiant API</div>
              <div style={{ color: '#475569', fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.id}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UserProfile;

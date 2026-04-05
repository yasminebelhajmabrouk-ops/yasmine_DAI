import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const UserProfile = ({ onBack }) => {
  const { user, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    specialty: user?.specialty || '',
    license_number: user?.license_number || '',
    password: '',
    confirm_password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: string }

  // Sync with user data if it changes in context
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        specialty: user.specialty || '',
        license_number: user.license_number || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirm_password) {
      setStatus({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    setLoading(true);
    setStatus(null);
    
    try {
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        specialty: formData.specialty,
        license_number: formData.license_number
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      await api.updateMe(updateData);
      
      // Update global context in real-time
      await refreshUser();
      
      setStatus({ type: 'success', text: 'Profil mis à jour avec succès !' });
      setFormData(prev => ({ ...prev, password: '', confirm_password: '' }));
      
    } catch (err) {
      console.error("Failed to update profile", err);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : "Erreur réseau";
      setStatus({ type: 'error', text: `Échec de la mise à jour : ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Récupération de vos identifiants...</p>
      </div>
    );
  }

  const doctorInitials = (formData.first_name?.[0] || 'D') + (formData.last_name?.[0] || 'R');

  return (
    <div className="dashboard-main-container animate-fade-in" style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="review-header" style={{ marginBottom: '24px' }}>
        <button className="btn-back-link" onClick={onBack} style={{ color: '#60a5fa', fontWeight: '800', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
          ← Retour au Tableau de Bord
        </button>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', marginTop: '12px', letterSpacing: '-0.02em' }}>
          Mon Profil Professionnel
        </h2>
        <div style={{ height: '3px', width: '50px', background: 'linear-gradient(to right, #3b82f6, transparent)', marginTop: '8px', borderRadius: '2px' }}></div>
      </div>

      <div className="profile-zen-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
        
        {/* Main Form Section */}
        <div className="glass-card zen-card" style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
          
          {status && (
            <div className={`notification-banner ${status.type}`} style={{ 
              marginBottom: '32px', 
              padding: '16px 20px', 
              borderRadius: '12px',
              background: status.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: status.type === 'success' ? '#10b981' : '#ef4444',
              border: `1px solid ${status.type === 'success' ? '#10b98144' : '#ef444444'}`,
              fontWeight: '600'
            }}>
              {status.type === 'success' ? '✓ ' : '✕ '}{status.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="zen-label">PRÉNOM</label>
                <input 
                  type="text" 
                  className="premium-textarea"
                  style={{ height: '40px', padding: '0 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem' }}
                  value={formData.first_name}
                  onChange={e => setFormData({...formData, first_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="zen-label">NOM</label>
                <input 
                  type="text" 
                  className="premium-textarea"
                  style={{ height: '40px', padding: '0 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem' }}
                  value={formData.last_name}
                  onChange={e => setFormData({...formData, last_name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="zen-label">EMAIL</label>
              <input 
                type="text" 
                className="premium-textarea"
                style={{ height: '40px', padding: '0 16px', background: 'rgba(255,255,255,0.03)', color: '#64748b', cursor: 'not-allowed', fontSize: '0.9rem' }}
                value={formData.email}
                disabled
              />
            </div>

            <div className="divider-zen" style={{ margin: '24px 0' }}></div>

            <h3 className="section-title-premium" style={{ marginBottom: '16px', color: '#3b82f6', letterSpacing: '0.05em', fontSize: '0.8rem' }}>ACCRÉDITATIONS</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="zen-label">UNITÉ / SPÉCIALITÉ</label>
                <select 
                  className="premium-textarea"
                  style={{ height: '40px', padding: '0 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem' }}
                  value={formData.specialty}
                  onChange={e => setFormData({...formData, specialty: e.target.value})}
                >
                  <option value="">Non renseigné</option>
                  <option value="Anesthésiste-Réanimateur">Anesthésiste-Réanimateur</option>
                  <option value="IADE">Infirmier Anesthésiste (IADE)</option>
                  <option value="Réanimateur Médical">Réanimateur Médical</option>
                  <option value="Chirurgien">Chirurgien</option>
                </select>
              </div>
              <div className="form-group">
                <label className="zen-label">NUMÉRO ADELI / RPPS</label>
                <input 
                  type="text" 
                  className="premium-textarea"
                  style={{ height: '40px', padding: '0 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem' }}
                  value={formData.license_number}
                  onChange={e => setFormData({...formData, license_number: e.target.value})}
                />
              </div>
            </div>

            <div className="divider-zen" style={{ margin: '24px 0' }}></div>

            <h3 className="section-title-premium" style={{ marginBottom: '16px', color: '#fff', letterSpacing: '0.05em', fontSize: '0.8rem' }}>SÉCURITÉ</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="zen-label">NOUVEAU MOT DE PASSE</label>
                <input 
                  type="password" 
                  autoComplete="new-password"
                  placeholder="Modifier..."
                  className="premium-textarea"
                  style={{ height: '40px', padding: '0 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem' }}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="zen-label">CONFIRMATION</label>
                <input 
                  type="password" 
                  autoComplete="new-password"
                  placeholder="Confirmer..."
                  className="premium-textarea"
                  style={{ height: '40px', padding: '0 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem' }}
                  value={formData.confirm_password}
                  onChange={e => setFormData({...formData, confirm_password: e.target.value})}
                />
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button 
                type="submit" 
                className="perop-btn primary" 
                style={{ width: '100%', height: '40px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '700' }}
                disabled={loading}
              >
                {loading ? 'Traitement...' : 'Sauvegarder les modifications'}
              </button>
            </div>
          </form>
        </div>

        {/* Professional Sidebar Preview */}
        <aside className="zen-sidebar">
          <div className="glass-card card-id-premium" style={{ 
            padding: '20px', 
            textAlign: 'center', 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            position: 'sticky',
            top: '20px'
          }}>
            <div className="profile-id-glow" style={{ 
              width: '70px', 
              height: '70px', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '50%',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: '900',
              color: 'white',
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.4)',
              border: '2px solid rgba(255,255,255,0.2)'
            }}>
              {doctorInitials}
            </div>
            
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '2px', fontWeight: '800' }}>
              Dr. {formData.first_name} {formData.last_name}
            </h3>
            <div style={{ color: '#60a5fa', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {formData.specialty || 'AGENT MÉDICAL DAI'}
            </div>
            
            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="zen-stat" style={{ textAlign: 'left' }}>
                <span className="zen-label" style={{ marginBottom: '2px', fontSize: '0.5rem' }}>ADELI / RPPS</span>
                <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: '600' }}>{formData.license_number || '---'}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .zen-label { font-size: 0.7rem; font-weight: 800; color: #64748b; letter-spacing: 0.1em; margin-bottom: 10px; display: block; }
        .divider-zen { height: 1px; background: linear-gradient(to right, rgba(255,255,255,0.1), transparent); }
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default UserProfile;

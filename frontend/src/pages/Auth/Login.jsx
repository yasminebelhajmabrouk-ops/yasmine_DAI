import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import anesthesiaBg from '../../assets/anesthesia_login_bg.png';
import './Auth.css';

const Login = () => {
  const [role, setRole] = useState('DOCTOR'); // 'DOCTOR' or 'PATIENT'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // In this app, email is used as username for login as well
    const res = await login(email, password);
    if (res.success) {
      // Check if the actual role matches the selected toggle
      if (res.role !== role) {
        logout();
        const roleName = res.role === 'DOCTOR' ? 'Médecin' : 'Patient';
        const expectedName = role === 'DOCTOR' ? 'Médecin' : 'Patient';
        setError(`Accès ${expectedName} refusé : Ce compte est enregistré en tant que ${roleName}. Veuillez utiliser le bouton approprié.`);
      } else {
        // Direct redirection to the appropriate dashboard
        if (res.role === 'DOCTOR') {
          navigate('/doctor-dashboard');
        } else if (res.role === 'PATIENT') {
          navigate('/patient-dashboard');
        } else {
          navigate('/');
        }
      }
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page animate-fade-in">
      {/* 🏥 Left Side: Hero Image Panel */}
      <div className="auth-side-image">
        <div className="auth-image-container">
          <img src={anesthesiaBg} alt="Anesthesia Monitoring" />
          <div className="auth-side-overlay"></div>
        </div>
        <div className="auth-side-footer">
          <div className="auth-side-logo">DAI-BMAD</div>
          <p className="auth-side-quote">
            "La précision technologique au service de la sécurité anesthésique."
          </p>
        </div>
      </div>

      {/* 📝 Right Side: Login Form Panel */}
      <div className="auth-form-container">
        {/* 🏠 Re-init/Home Button */}
        <button className="auth-back-btn" onClick={() => navigate('/')} title="Retour à l'accueil">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>

        <div className="auth-card">
          <div className="auth-header">
            <h1>Bienvenue</h1>
            <p>Connectez-vous à votre plateforme sécurisée.</p>
          </div>

          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn ${role === 'DOCTOR' ? 'active' : ''}`}
              onClick={() => setRole('DOCTOR')}
            >
              Médecin
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'PATIENT' ? 'active' : ''}`}
              onClick={() => setRole('PATIENT')}
            >
              Patient
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Adresse e-mail</label>
              <input
                type="email"
                className="form-input"
                placeholder="nom@hopital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="auth-footer">
            Vous n'avez pas de compte ? <Link to="/signup" className="auth-link">S'inscrire</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

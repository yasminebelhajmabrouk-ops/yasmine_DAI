import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [role, setRole] = useState('DOCTOR'); // 'DOCTOR' or 'PATIENT'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // In this app, email is used as username for login as well
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Bienvenue</h1>
          <p>Connectez-vous à votre compte DAI pour continuer.</p>
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
              placeholder="nom@email.com"
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
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          Vous n'avez pas de compte ? <Link to="/signup" className="auth-link">S'inscrire</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

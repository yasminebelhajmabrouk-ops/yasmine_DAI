import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const [role, setRole] = useState('DOCTOR'); // 'DOCTOR' or 'PATIENT'
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    specialty: '',
    license_number: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare data for backend
    // Since images don't show username, we'll use email as username
    const submissionData = {
      ...formData,
      username: formData.email, 
      role: role
    };

    const res = await register(submissionData);
    if (res.success) {
      navigate('/login');
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Créez votre compte</h1>
          <p>Commencez avec DAI en moins de 2 minutes.</p>
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
          <div className="form-row">
            <div className="form-group">
              <label>Prénom</label>
              <input 
                type="text" 
                name="first_name" 
                className="form-input" 
                placeholder="Jean"
                value={formData.first_name}
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input 
                type="text" 
                name="last_name" 
                className="form-input" 
                placeholder="Dupont"
                value={formData.last_name}
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Adresse e-mail</label>
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              placeholder={role === 'DOCTOR' ? 'docteur@hopital.org' : 'patient@email.com'}
              value={formData.email}
              onChange={handleChange} 
              required 
            />
          </div>

          {role === 'DOCTOR' && (
            <>
              <div className="form-group">
                <label>Spécialité</label>
                <input 
                  type="text" 
                  name="specialty" 
                  className="form-input" 
                  placeholder="Radiologie"
                  value={formData.specialty}
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Numéro de licence</label>
                <input 
                  type="text" 
                  name="license_number" 
                  className="form-input" 
                  placeholder="LIC-00000"
                  value={formData.license_number}
                  onChange={handleChange} 
                  required 
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                className="form-input" 
                placeholder="Min. 8 caractères"
                value={formData.password}
                onChange={handleChange} 
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
            {loading ? 'Création du compte...' : 'Créer un compte'}
          </button>

          <p className="terms-text">
            En créant un compte, vous acceptez nos <strong>Conditions d'utilisation</strong> et notre <strong>Politique de confidentialité</strong>.
          </p>
        </form>

        <div className="auth-footer">
          Vous avez déjà un compte ? <Link to="/login" className="auth-link">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ClipboardCheck,
  Stethoscope,
  ShieldCheck,
  Zap,
  Clock,
  ChevronRight,
  Play,
  HeartPulse,
  Syringe,
  Monitor
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroSurgery from '../assets/hero_surgery.png';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCommencer = () => {
    navigate('/login');
  };

  // Animations variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="landing-container">
      {/* 🧭 Navigation Bar */}
      <nav className="lp-navbar">
        <div className="lp-nav-logo">DAI-BMAD</div>
        <div className="lp-nav-links">
          <a href="#plateforme">Plateforme</a>
          <a href="#medecins">Pour Médecins</a>
          <a href="#patients">Pour Patients</a>
          <a href="#securite">Sécurité</a>
        </div>
        <div className="lp-nav-actions">
          <button className="nav-btn-text" onClick={() => navigate('/login')}>Se connecter</button>
          <button className="nav-btn-primary" onClick={() => navigate('/signup')}>S'inscrire</button>
        </div>
      </nav>

      {/* 🔝 Hero Section */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-tag">Technologie Médicale de Pointe</div>
          <h1 className="hero-title">
            Plateforme intelligente de <span>suivi anesthésique</span>
          </h1>
          <p className="hero-subtitle italic-text">
            Surveillance complète et temps réel du patient :{" "}
            <span className="subtitle-highlight">
              Pré, Per et Post-opératoire pour une sécurité optimale.
            </span>
          </p>
          <div className="hero-actions">
            <button className="btn-lp btn-lp-primary" onClick={handleCommencer}>
              Se connecter <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        <motion.div
          className="video-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img
            src={heroSurgery}
            alt="Surgical Team"
            className="demo-video"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.9) contrast(1.1)'
            }}
          />
        </motion.div>
      </section>

      {/* 🧩 Modules Section */}
      <section className="modules-section">
        <div className="section-header">
          <motion.h2
            className="section-title"
            initial="initial"
            whileInView="animate"
            variants={fadeInUp}
            viewport={{ once: true }}
          >
            Modules Intégrés
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial="initial"
            whileInView="animate"
            variants={fadeInUp}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Une solution bout-en-bout pour le cycle opératoire complet.
          </motion.p>
        </div>

        <motion.div
          className="modules-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Pré-opératoire */}
          <motion.div className="module-card" variants={fadeInUp}>
            <div className="module-icon-box">
              <ClipboardCheck size={28} />
            </div>
            <h3>Pré-opératoire</h3>
            <ul>
              <li>Évaluation des risques</li>
              <li>Questionnaire patient</li>
              <li>Planification anesthésique</li>
            </ul>
          </motion.div>

          {/* Per-opératoire */}
          <motion.div className="module-card" variants={fadeInUp}>
            <div className="module-icon-box" style={{ background: '#eef2ff', color: '#6366f1' }}>
              <Activity size={28} />
            </div>
            <h3>Per-opératoire</h3>
            <ul>
              <li>Monitoring temps réel</li>
              <li>Signes vitaux (ECG, SpO2)</li>
              <li>Administration médicaments</li>
              <li>Alertes automatiques</li>
            </ul>
          </motion.div>

          {/* Post-opératoire */}
          <motion.div className="module-card" variants={fadeInUp}>
            <div className="module-icon-box" style={{ background: '#f0fdf4', color: '#22c55e' }}>
              <HeartPulse size={28} />
            </div>
            <h3>Post-opératoire</h3>
            <ul>
              <li>Suivi SSPI</li>
              <li>Gestion de la douleur</li>
              <li>Surveillance récupération</li>
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* 📊 Statistiques Section */}
      <section className="stats-section">
        <motion.div
          className="stats-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="stat-card">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">Sécurité Patient</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">&lt;1s</span>
            <span className="stat-label">Temps de Réponse</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">24/7</span>
            <span className="stat-label">SLA Garanti</span>
          </div>
        </motion.div>
      </section>

      {/* Footer / Final CTA */}
      <footer style={{ padding: '80px 5% 40px', textAlign: 'center', background: 'var(--lp-bg)' }}>
        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', background: 'white' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Prêt à moderniser votre bloc ?</h2>
          <p style={{ color: 'var(--lp-text-muted)', marginBottom: '32px' }}>
            Rejoignez les centres hospitaliers qui font confiance à DAI-BMAD pour leur suivi anesthésique.
          </p>
          <button className="btn-lp btn-lp-primary" onClick={() => navigate('/signup')}>
            S'inscrire <ChevronRight size={18} />
          </button>
        </div>
        <div style={{ marginTop: '60px', color: 'var(--lp-text-muted)', fontSize: '0.9rem' }}>
          © 2026 DAI-BMAD Platform. Mission Critical Health Solutions.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

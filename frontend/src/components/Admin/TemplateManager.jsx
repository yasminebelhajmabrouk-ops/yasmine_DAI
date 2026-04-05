import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import TemplateEditorModal from './TemplateEditorModal';
import './Admin.css';

const TemplateManager = ({ onBack }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await api.getTemplates();
      setTemplates(res.data);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingTemplate(null);
    setShowModal(true);
  };

  const handleToggleStatus = async (template) => {
    try {
      await api.updateTemplate(template.id, { is_active: !template.is_active });
      fetchTemplates();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  // Group templates by section
  const groupedTemplates = templates.reduce((acc, t) => {
    if (!acc[t.section]) acc[t.section] = [];
    acc[t.section].push(t);
    return acc;
  }, {});

  const formatType = (type) => {
    const map = {
      'CHOICE': 'Choix Unique',
      'TEXT': 'Texte libre',
      'NUMBER': 'Nombre',
      'BOOLEAN': 'Oui/Non',
      'DATE': 'Date',
    };
    return map[type] || type;
  };

  if (loading) {
    return (
      <div className="pq-center">
        <div className="loader"></div>
        <p>Chargement des modèles...</p>
      </div>
    );
  }

  return (
    <div className="admin-container animate-fade-in">
      <header className="admin-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button className="btn btn-secondary" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', width: 'fit-content' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Retour au Tableau de Bord
          </button>
          <div>
            <h1 className="feed-title-blue" style={{ fontSize: '1.6rem' }}>
              Gestionnaire de Questionnaire
            </h1>
            <p style={{ color: '#fff', opacity: '0.9', marginTop: '6px', fontSize: '0.95rem', fontWeight: '500' }}>
              Configurez les questions cliniques de l'évaluation pré-opératoire de manière dynamique.
            </p>
          </div>
        </div>
        <button className="perop-btn primary" onClick={handleAdd} style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: '700' }}>
          + Ajouter une Question
        </button>
      </header>

      <div className="admin-body">
        {Object.entries(groupedTemplates).map(([section, qs]) => (
          <div key={section} className="section-group">
            <div className="section-header">
              <span className="section-title">{section.toUpperCase()}</span>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{qs.length} question(s)</span>
            </div>

            <table className="template-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Libellé (FR)</th>
                  <th>Type</th>
                  <th>Obligatoire</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {qs.map(t => (
                  <tr key={t.id} className="template-row">
                    <td style={{ fontFamily: 'monospace', color: '#3b82f6', fontWeight: '700' }}>{t.question_code}</td>
                    <td style={{ color: '#fff', fontWeight: '600' }}>{t.label_fr}</td>
                    <td>
                      <span className="type-badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {formatType(t.answer_type)}
                      </span>
                    </td>
                    <td style={{ color: '#fff' }}>{t.is_required ? '✓ Oui' : '--'}</td>
                    <td>
                      <span className={t.is_active ? 'status-active' : 'status-inactive'} style={{ fontWeight: '700' }}>
                        {t.is_active ? '● Actif' : '● Inactif'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="pd-btn-outline" style={{ fontSize: '0.7rem', padding: '4px 8px' }} onClick={() => handleEdit(t)}>
                          Éditer
                        </button>
                        <button
                          className="btn-cancel-mini"
                          onClick={() => handleToggleStatus(t)}
                        >
                          {t.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {showModal && (
        <TemplateEditorModal
          template={editingTemplate}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetchTemplates();
          }}
        />
      )}
    </div>
  );
};

export default TemplateManager;

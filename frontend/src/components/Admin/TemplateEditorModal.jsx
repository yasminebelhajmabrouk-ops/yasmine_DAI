import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';

const TemplateEditorModal = ({ template, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    section: '',
    question_code: '',
    label_fr: '',
    label_ar: '',
    answer_type: 'BOOLEAN',
    is_required: false,
    used_for_scores: false,
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData(template);
    }
  }, [template]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (template?.id) {
        await api.updateTemplate(template.id, formData);
      } else {
        await api.createTemplate(formData);
      }
      onSave();
    } catch (err) {
      console.error("Failed to save template", err);
      alert("Erreur lors de l'enregistrement. Vérifiez que le code de question est unique.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ display: 'block' }}>
        <h2 style={{ marginBottom: '24px', fontWeight: '800', color: '#fff' }}>
          {template ? 'MODIFIER LA QUESTION' : 'NOUVELLE QUESTION'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="full-width">
              <label className="admin-label">Section clinique</label>
              <input 
                className="admin-input" 
                placeholder="Ex: Cardio-vasculaire"
                value={formData.section}
                onChange={e => setFormData({...formData, section: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="admin-label">Code interne (unique)</label>
              <input 
                className="admin-input" 
                placeholder="Ex: HTA_KNOWN"
                value={formData.question_code}
                onChange={e => setFormData({...formData, question_code: e.target.value})}
                disabled={!!template}
                required
              />
            </div>

            <div>
              <label className="admin-label">Type de réponse</label>
              <select 
                className="admin-select"
                value={formData.answer_type}
                onChange={e => setFormData({...formData, answer_type: e.target.value})}
              >
                <option value="BOOLEAN">Booleen (Oui/Non)</option>
                <option value="TEXT">Texte libre</option>
                <option value="NUMBER">Nombre</option>
                <option value="CHOICE">Choix unique</option>
                <option value="DATE">Date</option>
              </select>
            </div>

            <div className="full-width">
              <label className="admin-label">Libellé (Français)</label>
              <input 
                className="admin-input" 
                value={formData.label_fr}
                onChange={e => setFormData({...formData, label_fr: e.target.value})}
                required
              />
            </div>

            <div className="full-width">
              <label className="admin-label">Libellé (Arabe - optionnel)</label>
              <input 
                className="admin-input" 
                style={{ direction: 'rtl', textAlign: 'right' }}
                value={formData.label_ar}
                onChange={e => setFormData({...formData, label_ar: e.target.value})}
              />
            </div>

            <div className="checkbox-row">
              <input 
                type="checkbox" 
                checked={formData.is_required}
                onChange={e => setFormData({...formData, is_required: e.target.checked})}
              />
              <span className="admin-label" style={{ margin: 0 }}>Réponse obligatoire</span>
            </div>

            <div className="checkbox-row">
              <input 
                type="checkbox" 
                checked={formData.used_for_scores}
                onChange={e => setFormData({...formData, used_for_scores: e.target.checked})}
              />
              <span className="admin-label" style={{ margin: 0 }}>Utilisée pour les scores</span>
            </div>
            
            <div className="checkbox-row">
              <input 
                type="checkbox" 
                checked={formData.is_active}
                onChange={e => setFormData({...formData, is_active: e.target.checked})}
              />
              <span className="admin-label" style={{ margin: 0 }}>Activée</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button 
              type="button" 
              className="pd-btn-outline" 
              style={{ flex: 1 }} 
              onClick={onClose}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="perop-btn primary" 
              style={{ flex: 2 }}
              disabled={submitting}
            >
              {submitting ? 'Enregistrement...' : 'Enregistrer la question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateEditorModal;

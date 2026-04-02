import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import './DicomViewer.css';

const dicomImages = [
  { id: 1, type: "Axial CT" },
  { id: 2, type: "Coronal CT" },
  { id: 3, type: "Sagittal CT" }
];

const DicomViewerModal = ({ isOpen, onClose, patientName }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dicomData, setDicomData] = useState(null);
  
  // Données réelles du backend
  useEffect(() => {
    if (isOpen) {
      const fetchDicom = async () => {
        setLoading(true);
        try {
          const res = await api.getDicomImage();
          setDicomData(res.data);
        } catch (err) {
          console.error("Failed to fetch DICOM image", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDicom();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="dicom-modal-overlay">
      <div className="dicom-modal-content glass-card">
        <div className="dicom-modal-header">
          <div className="dicom-p-info">
            <h3>Visionneuse DICOM</h3>
            <span>Patient: {patientName} • ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
          </div>
          <button className="btn-close-dicom" onClick={onClose}>×</button>
        </div>

        <div className="dicom-viewer-container">
          <div className="dicom-main-view">
            {loading ? (
              <div className="dicom-loader">
                <div className="spinner"></div>
                <span>Chargement de l'examen...</span>
              </div>
            ) : dicomData && (
              <div className="dicom-image-wrapper">
                <img 
                  src={dicomData.image.startsWith('http') ? dicomData.image : `data:image/png;base64,${dicomData.image}`} 
                  alt="DICOM View" 
                  className="dicom-real-image"
                />
                <div className="overlay-data-top-left">
                  Modality: {dicomData.info.Modality}<br/>
                  Source: {dicomData.info.PatientName}
                </div>
                <div className="overlay-data-bottom-right">
                  DAI-BMAD Engine<br/>
                  Patient ID: {dicomData.info.PatientID}
                </div>
              </div>
            )}
          </div>

          <div className="dicom-sidebar">
            <div className="dicom-tools">
              <h4>Outils</h4>
              <button className="tool-btn">🔍 Zoom</button>
              <button className="tool-btn">📏 Mesure</button>
              <button className="tool-btn">🌓 Contraste</button>
              <button className="tool-btn active">🤖 IA Seg.</button>
            </div>
            
            <div className="dicom-thumbnails">
              <h4>Séries</h4>
              {dicomImages.map((img, idx) => (
                <div 
                  key={img.id} 
                  className={`thumb-item ${currentIdx === idx ? 'active' : ''}`}
                  onClick={() => setCurrentIdx(idx)}
                >
                  <div className="thumb-preview"></div>
                  <span>{img.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dicom-footer">
          <div className="dicom-controls">
            <button onClick={() => setCurrentIdx(p => Math.max(0, p-1))}>Précédent</button>
            <span className="slice-indicator">Image {currentIdx + 1} / {dicomImages.length}</span>
            <button onClick={() => setCurrentIdx(p => Math.min(dicomImages.length-1, p+1))}>Suivant</button>
          </div>
          <button className="btn-export">Exporter Rapport</button>
        </div>
      </div>
    </div>
  );
};

export default DicomViewerModal;

import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Intercepteur pour ajouter le token JWT
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── API Endpoints ──

export const api = {
  // Auth
  login: (username, password) => client.post('/token/', { username, password }),
  register: (userData) => client.post('/register/', userData),
  getMe: () => client.get('/me/'),

  // Health
  health: () => client.get('/health/'),

  // Patients
  getPatients: () => client.get('/patients/'),
  getPatient: (id) => client.get(`/patients/${id}/`),
  createPatient: (data) => client.post('/patients/', data),

  // Cases (Anesthesia Case / Dossier)
  getCases: () => client.get('/cases/'),
  getCasesByPatient: (patientId) => client.get('/cases/', { params: { patient: patientId } }),
  getCase: (id) => client.get(`/cases/${id}/`),
  createCase: (data) => client.post('/cases/', data),
  updateCase: (id, data) => client.patch(`/cases/${id}/`, data),

  // Question Templates
  getQuestionTemplates: () => client.get('/question-templates/'),

  // PreOp Questionnaires
  getQuestionnaires: () => client.get('/preop-questionnaires/'),
  getQuestionnaire: (id) => client.get(`/preop-questionnaires/${id}/`),
  createQuestionnaire: (data) => client.post('/preop-questionnaires/', data),
  updateQuestionnaire: (id, data) => client.patch(`/preop-questionnaires/${id}/`, data),
  getQuestionnaireForm: (id) => client.get(`/preop-questionnaires/${id}/form/`),
  computeScores: (id) => client.post(`/preop-questionnaires/${id}/compute-scores/`),

  // PreOp Responses
  getResponses: () => client.get('/preop-responses/'),
  createResponse: (data) => client.post('/preop-responses/', data),
  updateResponse: (id, data) => client.patch(`/preop-responses/${id}/`, data),

  // Clinical Scores
  getScores: () => client.get('/clinical-scores/'),

  // Audit Logs
  getAuditLogs: () => client.get('/audit-logs/'),
  getCaseAuditLogs: (caseId) => client.get('/audit-logs/', { params: { entity_id: caseId } }),

  // Standalone Calculation
  calculateRiskStandalone: (responses) => client.post('/preop/standalone-compute/', { responses }),

  // DICOM Imager
  getDicomImage: () => client.get('/preop/dicom-view/'),
};

export { client };
export default api;

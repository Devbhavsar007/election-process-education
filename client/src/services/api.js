import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('civicverse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('civicverse_token');
      localStorage.removeItem('civicverse_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

/* ── Auth ─────────────────────────────────────────────── */
export const registerUser = (data) => api.post('/api/auth/register', data);
export const loginUser = (data) => api.post('/api/auth/login', data);
export const googleAuth = (idToken) => api.post('/api/auth/google', { idToken });
export const completeProfile = (data) => api.post('/api/auth/complete-profile', data);
export const getMe = () => api.get('/api/auth/me');

/* ── Chat ─────────────────────────────────────────────── */
export const sendChat = (message, history = []) => api.post('/api/chat', { message, history });

/* ── Journey ──────────────────────────────────────────── */
export const getJourney = (userId) => api.get(`/api/journey/${userId}`);

/* ── Timeline ─────────────────────────────────────────── */
export const getTimeline = (userId) => api.get(`/api/timeline/${userId}`);

/* ── Booth ────────────────────────────────────────────── */
export const findBooth = (address, state) => api.post('/api/booth', { address, state });

/* ── Scenario ─────────────────────────────────────────── */
export const runScenario = (scenario) => api.post('/api/scenario', { scenario });

/* ── Quiz ─────────────────────────────────────────────── */
export const getQuiz = () => api.get('/api/quiz');
export const submitQuiz = (answers) => api.post('/api/quiz/submit', { answers });

/* ── Translate ────────────────────────────────────────── */
export const translateText = (text, targetLang) => api.post('/api/translate', { text, targetLang });

/* ── User ─────────────────────────────────────────────── */
export const initUser = (data) => api.post('/api/user/init', data);
export const getUser = (userId) => api.get(`/api/user/${userId}`);

/* ── Checklist ────────────────────────────────────────── */
export const getChecklist = (userId) => api.get(`/api/checklist/${userId}`);
export const updateChecklist = (userId, items) => api.post('/api/checklist/update', { userId, items });

/* ── Analytics ────────────────────────────────────────── */
export const getInsights = (userId) => api.get(`/api/analytics/insights/${userId}`);

/* ── Health ────────────────────────────────────────────── */
export const getHealth = () => api.get('/api/health');

export default api;

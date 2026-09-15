import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 12000,
});

// Auto-attach the JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function analyzeText(text) {
  const { data } = await api.post('/analyze', { text });
  return data;
}

export async function saveAnalysis(payload) {
  const { data } = await api.post('/save', payload);
  return data;
}

export async function fetchAnalytics() {
  const { data } = await api.get('/analytics');
  return data;
}

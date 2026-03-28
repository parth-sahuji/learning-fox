import axios from 'axios';

// Directly point to Render backend in production
// Vercel proxy rewrites don't work reliably for POST/multipart requests
const RENDER_URL = 'https://learning-fox-api.onrender.com';

const isLocalDev = window.location.hostname === 'localhost';
const baseURL = isLocalDev ? '/api' : `${RENDER_URL}/api`;

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60 second timeout (Render cold start can take 30s)
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('tutorapp_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tutorapp_token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

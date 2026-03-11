import axios from 'axios';

// Base Axios instance — all API calls go through this
// In dev, Vite proxy forwards /api to localhost:5000
// In production, change this to your deployed backend URL
const api = axios.create({
  baseURL: '/api',
});

// Automatically attach JWT token to admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

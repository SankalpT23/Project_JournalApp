import axios from 'axios';

// Create Axios instance
// In development (Vite), we use the Proxy defined in vite.config.ts to forward requests to localhost:8080
// In production, we can set VITE_API_BASE_URL to the actual backend URL, or rely on the same host if served together.
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: baseURL, // Using variable for flexibility
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

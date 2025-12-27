/// &lt;reference types="vite/client" /&gt;

import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '../store/authStore';

// Development ortamında proxy kullan
const API_BASE_URL = '';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - JWT token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - 401'de logout yap
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz veya süresi dolmuş
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      useAuthStore.setState({ token: null, user: null });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data: { email: string; username: string; password: string; password2: string }) =>
    api.post('/auth/register/', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login/', data),
  logout: (refreshToken: string) =>
    api.post('/auth/logout/', { refresh: refreshToken }),
  getCurrentUser: () =>
    api.get('/auth/me/'),
};

// URL shortener endpoints
export const urlAPI = {
  shorten: (data: { target_url: string; is_private: boolean }) =>
    api.post('/urls/shorten/', data),
  list: () =>
    api.get('/urls/'),
  getDetails: (id: number) =>
    api.get(`/urls/${id}/`),
  update: (id: number, data: { target_url?: string; is_private?: boolean }) =>
    api.patch(`/urls/${id}/update/`, data),
  delete: (id: number) =>
    api.delete(`/urls/${id}/delete/`),
  bulkUpload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/urls/bulk/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;

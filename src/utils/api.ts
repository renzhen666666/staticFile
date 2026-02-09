import axios from 'axios';
import type { AuthResponse, File, FileStats, UploadResponse, ShareFile, QRCodeResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (username: string, email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { username, email, password }),
  
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
};

export const fileAPI = {
  upload: (formData: FormData) =>
    api.post<UploadResponse>('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getFiles: (search?: string) =>
    api.get<File[]>('/files', { params: { search } }),
  
  getFile: (id: number) =>
    api.get<File>(`/files/${id}`),
  
  deleteFile: (id: number) =>
    api.delete(`/files/${id}`),
  
  updateFile: (id: number, data: { password?: string; expiresInDays?: number }) =>
    api.put(`/files/${id}`, data),
  
  getStats: () =>
    api.get<FileStats>('/files/stats'),
};

export const shareAPI = {
  getFile: (shortLink: string, password?: string) =>
    api.get<ShareFile>(`/share/${shortLink}`, { params: { password } }),
  
  downloadFile: (shortLink: string, password?: string) => {
    const url = `${API_BASE_URL}/share/download/${shortLink}${password ? `?password=${password}` : ''}`;
    window.open(url, '_blank');
  },
  
  generateQRCode: (shortLink: string) =>
    api.get<QRCodeResponse>(`/share/qrcode/${shortLink}`),
};

export default api;

import axios from 'axios';
import { getAuthToken } from './authStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchGallery = async () => {
  const response = await apiClient.get('/api/gallery');
  return response.data;
};

export const createGalleryItem = async (payload) => {
  const response = await apiClient.post('/api/gallery', payload);
  return response.data;
};

export const deleteGalleryItem = async (id) => {
  await apiClient.delete(`/api/gallery/${id}`);
};

export const fetchBeforeAfter = async () => {
  const response = await apiClient.get('/api/before-after');
  return response.data;
};

export const createBeforeAfter = async (payload) => {
  const response = await apiClient.post('/api/before-after', payload);
  return response.data;
};

export const deleteBeforeAfter = async (id) => {
  await apiClient.delete(`/api/before-after/${id}`);
};

export const fetchServices = async () => {
  const response = await apiClient.get('/api/services');
  return response.data;
};

export const createService = async (payload) => {
  const response = await apiClient.post('/api/services', payload);
  return response.data;
};

export const deleteService = async (id) => {
  await apiClient.delete(`/api/services/${id}`);
};

export const fetchContactRequests = async () => {
  const response = await apiClient.get('/api/contact-requests');
  return response.data;
};

export const createContactRequest = async (payload) => {
  const response = await apiClient.post('/api/contact-requests', payload);
  return response.data;
};

export const deleteContactRequest = async (id) => {
  await apiClient.delete(`/api/contact-requests/${id}`);
};

export const adminLogin = async (email, password) => {
  const response = await apiClient.post('/api/auth/admin/login', { email, password });
  return response.data;
};

export const changePassword = async (payload) => {
  const response = await apiClient.post('/api/auth/password', payload);
  return response.data;
};

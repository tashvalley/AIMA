import api from './api';

export const generatePost = (prompt) =>
  api.post('/api/content/generate-post', { prompt });

export const generateVideo = (prompt) =>
  api.post('/api/content/generate-video', { prompt });

export const getContentHistory = (params) =>
  api.get('/api/content/history', { params });

export const getContentById = (id) =>
  api.get(`/api/content/${id}`);

export const deleteContent = (id) =>
  api.delete(`/api/content/${id}`);

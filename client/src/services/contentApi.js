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

export const downloadContent = async (id, filename) => {
  const response = await api.get(`/api/content/${id}/download`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

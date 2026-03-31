import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

const api = axios.create({ baseURL: API_BASE });

export async function fetchDocuments(params = {}) {
  const res = await api.get('/api/documents', { params });
  return res.data;
}

export async function getDocument(id) {
  const res = await api.get(`/api/documents/${id}`);
  return res.data;
}

export async function createDocument(payload) {
  const res = await api.post('/api/documents', payload);
  return res.data;
}

export async function deleteDocument(id) {
  const res = await api.delete(`/api/documents/${id}`);
  return res.data;
}

export async function queryDocuments(payload) {
  const res = await api.post('/api/query', payload);
  return res.data;
}

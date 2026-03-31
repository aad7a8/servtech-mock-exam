import axios from 'axios';

// In development, requests to /api/* are proxied to the backend via package.json "proxy".
// In production or Codespaces, set REACT_APP_API_BASE to the backend URL.
// When using Codespaces, set it to the forwarded backend URL, e.g.:
//   REACT_APP_API_BASE=https://obscure-pancake-xxx-8000.app.github.dev
const API_BASE = process.env.REACT_APP_API_BASE || '';

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

import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

export async function fetchDocuments() {
  const res = await axios.get(`${API_BASE}/api/documents`);
  return res.data;
}

export async function createDocument(payload) {
  const res = await axios.post(`${API_BASE}/api/documents`, payload);
  return res.data;
}

export async function queryDocuments(payload) {
  const res = await axios.post(`${API_BASE}/api/query`, payload);
  return res.data;
}

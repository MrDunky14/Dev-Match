import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://dev-match-qcjf.onrender.com/api',
});

// ── Users ──────────────────────────────────────────────
export const getUsers = (params = {}) => API.get('/users', { params });
export const getUser = (id) => API.get(`/users/${id}`);
export const createUser = (data) => API.post('/users', data);

// ── Projects ───────────────────────────────────────────
export const getProjects = (params = {}) => API.get('/projects', { params });
export const getProject = (id) => API.get(`/projects/${id}`);
export const createProject = (data) => API.post('/projects', data);

// ── Meta ───────────────────────────────────────────────
export const getSkills = () => API.get('/skills');
export const getStats = () => API.get('/stats');

// ── Messages ────────────────────────────────────────
export const sendMessage = (data) => API.post('/messages', data);
export const getMessages = (userId) => API.get(`/messages/${userId}`);
export const getConversation = (user1Id, user2Id) => API.get(`/messages/${user1Id}/${user2Id}`);

export default API;

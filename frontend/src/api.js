import axios from 'axios';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:8000/api' : 'https://dev-match-qcjf.onrender.com/api'),
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

// ── GitHub ──────────────────────────────────────────
export const fetchGitHubProfile = (username) => API.get(`/github/${username}`);

// ── Applications ────────────────────────────────────
export const applyToProject = (projectId, data) => API.post(`/projects/${projectId}/apply`, data);
export const getProjectApplications = (projectId) => API.get(`/projects/${projectId}/applications`);
export const getApplicationCount = (projectId) => API.get(`/projects/${projectId}/application-count`);
export const updateApplication = (appId, status) => API.patch(`/applications/${appId}?status=${status}`);

// ── Devlogs ─────────────────────────────────────────
export const createDevlog = (data) => API.post('/devlogs', data);
export const getDevlogs = (limit = 50) => API.get('/devlogs', { params: { limit } });

// ── Announcements ───────────────────────────────────
export const getAnnouncements = (tag) => API.get('/announcements', { params: tag ? { tag } : {} });
export const createAnnouncement = (data) => API.post('/announcements', data);

export default API;

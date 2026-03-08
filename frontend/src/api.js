import axios from 'axios';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:8000/api' : 'https://dev-match-qcjf.onrender.com/api'),
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('devmatch_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Simple in-memory GET cache ─────────────────────────
const _cache = new Map();
const DEFAULT_TTL = 60_000; // 1 minute

function getCacheKey(url, params) {
  return url + (params ? '?' + new URLSearchParams(params).toString() : '');
}

/**
 * Cached GET — returns cached response if fresh, otherwise fetches.
 * @param {string} url
 * @param {object} opts  { params, ttl (ms), bust (boolean) }
 */
function cachedGet(url, { params, ttl = DEFAULT_TTL, bust = false } = {}) {
  const key = getCacheKey(url, params);
  const entry = _cache.get(key);
  if (!bust && entry && Date.now() - entry.ts < ttl) {
    return Promise.resolve(entry.data);
  }
  return API.get(url, { params }).then((res) => {
    _cache.set(key, { data: res, ts: Date.now() });
    return res;
  });
}

/** Invalidate cache entries whose key starts with the given prefix. */
export function invalidateCache(prefix) {
  for (const key of _cache.keys()) {
    if (key.startsWith(prefix)) _cache.delete(key);
  }
}

// ── Auth ───────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// ── Users ──────────────────────────────────────────────
export const getUsers = (params = {}) => cachedGet('/users', { params, ttl: 30_000 });
export const getUser = (id) => cachedGet(`/users/${id}`, { ttl: 60_000 });
export const createUser = (data) => API.post('/users', data).then(r => { invalidateCache('/users'); return r; });
export const updateUser = (id, data) => API.put(`/users/${id}`, data).then(r => { invalidateCache('/users'); return r; });
export const deleteUser = (id) => API.delete(`/users/${id}`).then(r => { invalidateCache('/users'); return r; });
export const getUserByEmail = (email) => cachedGet(`/users/by-email/${encodeURIComponent(email)}`, { ttl: 30_000 });
export const getUserProjects = (userId) => cachedGet(`/users/${userId}/projects`, { ttl: 30_000 });
export const getReceivedApplications = (userId) => API.get(`/users/${userId}/received-applications`);
export const getMyApplications = (userId) => API.get(`/users/${userId}/my-applications`);
export const getCompatibility = (userId, withUserId) => cachedGet(`/users/${userId}/compatibility`, { params: { with_user: withUserId }, ttl: 120_000 });

// ── Projects ───────────────────────────────────────────
export const getProjects = (params = {}) => cachedGet('/projects', { params, ttl: 30_000 });
export const getProject = (id) => cachedGet(`/projects/${id}`, { ttl: 60_000 });
export const createProject = (data) => API.post('/projects', data).then(r => { invalidateCache('/projects'); return r; });
export const updateProject = (id, data) => API.put(`/projects/${id}`, data).then(r => { invalidateCache('/projects'); return r; });
export const deleteProject = (id) => API.delete(`/projects/${id}`).then(r => { invalidateCache('/projects'); return r; });

// ── Meta ───────────────────────────────────────────────
export const getSkills = () => cachedGet('/skills', { ttl: 300_000 });
export const getStats = () => cachedGet('/stats', { ttl: 60_000 });
export const getSkillTrends = () => cachedGet('/stats/skills', { ttl: 300_000 });

// ── Messages ────────────────────────────────────────
export const sendMessage = (data) => API.post('/messages', data);
export const getMessages = (userId) => API.get(`/messages/${userId}`);
export const getConversation = (user1Id, user2Id) => API.get(`/messages/${user1Id}/${user2Id}`);

// ── GitHub ──────────────────────────────────────────
export const fetchGitHubProfile = (username) => cachedGet(`/github/${username}`, { ttl: 300_000 });

// ── Applications ────────────────────────────────────
export const applyToProject = (projectId, data) => API.post(`/projects/${projectId}/apply`, data).then(r => { invalidateCache('/projects'); return r; });
export const getProjectApplications = (projectId) => API.get(`/projects/${projectId}/applications`);
export const getApplicationCount = (projectId) => cachedGet(`/projects/${projectId}/application-count`, { ttl: 30_000 });
export const updateApplication = (appId, status) => API.patch(`/applications/${appId}?status=${status}`);

// ── Devlogs ─────────────────────────────────────────
export const createDevlog = (data) => API.post('/devlogs', data).then(r => { invalidateCache('/devlogs'); return r; });
export const getDevlogs = (limit = 50) => cachedGet('/devlogs', { params: { limit }, ttl: 15_000 });
export const toggleReaction = (devlogId, data) => API.post(`/devlogs/${devlogId}/react`, data).then(r => { invalidateCache('/devlogs'); return r; });

// ── Leaderboard ─────────────────────────────────────
export const getLeaderboard = () => cachedGet('/leaderboard', { ttl: 60_000 });

// ── Announcements ───────────────────────────────────
export const getAnnouncements = (tag) => cachedGet('/announcements', { params: tag ? { tag } : {}, ttl: 30_000 });
export const createAnnouncement = (data) => API.post('/announcements', data).then(r => { invalidateCache('/announcements'); return r; });

// ── Notifications ───────────────────────────────────
export const getNotifications = (unreadOnly = false) => API.get('/notifications', { params: { unread_only: unreadOnly } });
export const getNotificationCount = () => API.get('/notifications/count');
export const markNotificationRead = (id) => API.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.post('/notifications/read-all');

// ── Endorsements ────────────────────────────────────
export const endorseSkill = (userId, skillName) => API.post(`/users/${userId}/endorse`, { skill_name: skillName }).then(r => { invalidateCache(`/users/${userId}/endorsements`); return r; });
export const getEndorsements = (userId) => cachedGet(`/users/${userId}/endorsements`, { ttl: 30_000 });

export default API;

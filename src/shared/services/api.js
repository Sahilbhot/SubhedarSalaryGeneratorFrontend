const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'subhedar_auth_token';

// ── Token storage ─────────────────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// ── Core request helper (attaches the Bearer token when present) ───────────
async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(json.error || 'Request failed');
    error.status = res.status;
    throw error;
  }
  return json;
}

const toQuery = (params) => {
  const q = new URLSearchParams(
    Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ).toString();
  return q ? `?${q}` : '';
};

export const api = {
  // ── Auth ──
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/api/auth/me'),

  // ── Employees ──
  getEmployees: () => request('/api/employees'),
  getEmployee: (id) => request(`/api/employees/${id}`),
  createEmployee: (data) =>
    request('/api/employees', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id, data) =>
    request(`/api/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEmployee: (id) => request(`/api/employees/${id}`, { method: 'DELETE' }),

  // ── Users (admin) ──
  getUsers: (params) => request(`/api/users${toQuery(params)}`),
  createUser: (data) => request('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) =>
    request(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  setUserStatus: (id, isActive) =>
    request(`/api/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    }),

  // ── Branches ──
  getBranches: () => request('/api/branches'),
  createBranch: (data) => request('/api/branches', { method: 'POST', body: JSON.stringify(data) }),
  updateBranch: (id, data) =>
    request(`/api/branches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

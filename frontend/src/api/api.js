import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edupredict_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('edupredict_token');
      localStorage.removeItem('edupredict_user');
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      window.location.href = isAdminRoute ? '/admin-login' : '/login';
    }
    return Promise.reject(error);
  }
);

/* ── Auth ──────────────────────────────────────────────── */
export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  profile:  ()     => api.get('/auth/profile'),
};

/* ── Students ──────────────────────────────────────────── */
export const studentsAPI = {
  getAll:   (params) => api.get('/students', { params }),
  getById:  (id)     => api.get(`/students/${id}`),
  create:   (data)   => api.post('/students', data),
  update:   (id, data) => api.put(`/students/${id}`, data),
  delete:   (id)     => api.delete(`/students/${id}`),
};

/* ── Predictions ───────────────────────────────────────── */
export const predictionsAPI = {
  create:   (data) => api.post('/predictions', data),
  getAll:   ()     => api.get('/predictions'),
  getById:  (id)   => api.get(`/predictions/${id}`),
};

/* ── Admin ─────────────────────────────────────────────── */
export const adminAPI = {
  getUsers:      ()   => api.get('/admin/users'),
  deleteUser:    (id) => api.delete(`/admin/users/${id}`),
  getStatistics: ()   => api.get('/admin/statistics'),
};

export default api;

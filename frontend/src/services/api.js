import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export const machineService = {
  getAll: () => api.get('/machines'),
};

export const workloadService = {
  getAll: () => api.get('/workloads'),
  create: (data) => api.post('/workloads', data),
  delete: (id) => api.delete(`/workloads/${id}`),
};

export default api;

import axios from 'axios';

// Centralized Axios instance. Adjust baseURL to your backend URL when available.
const api = axios.create({
  baseURL: '/api',
  withCredentials: false,
});

// Attach JWT and Tenant headers on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  const licenseId = localStorage.getItem('licenseId');

  if (!config.headers) {
    config.headers = {} as any;
  }
  if (token) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  if (licenseId) {
    // Use the header name your backend expects (X-Tenant-Id / X-License-Id)
    (config.headers as any)['X-Tenant-Id'] = licenseId;
  }
  return config;
});

// Redirect to login on 401 and clear session
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('licenseId');
      localStorage.removeItem('licenseName');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: false,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  const licenseId = localStorage.getItem('licenseId');

  if (!config.headers) {
    config.headers = {} as any;
  }
  if (token) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  if (licenseId) {
    (config.headers as any)['X-Tenant-Id'] = licenseId;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  error => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('licenseId');
      localStorage.removeItem('licenseName');
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

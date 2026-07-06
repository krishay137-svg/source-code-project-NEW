import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data || { error: err.message })
);

export function uploadFormData(url, formData) {
  return api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export default api;

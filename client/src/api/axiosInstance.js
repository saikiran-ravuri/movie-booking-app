import axios from 'axios';

export const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// attach x-access-token header to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  if (token) {
    config.headers['x-access-token'] = token;
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

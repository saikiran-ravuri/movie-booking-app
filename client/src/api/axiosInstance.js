import axios from 'axios';

// create axios instance to talk to backend
export const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// attach request interceptor to auto send bearer jwt token in headers
axiosInstance.interceptors.request.use((config) => {
    // get access token from local storage
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

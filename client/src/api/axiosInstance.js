import axios from 'axios';

// create axios instance to talk to backend
export const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

import axios from 'axios';

const api = axios.create({
    baseURL: '/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// NEW: Axios Request Interceptor
api.interceptors.request.use(
    (config) => {
        // 1. Before any request leaves the frontend, look for the token in Local Storage
        const token = localStorage.getItem('devsync_token');
        
        // 2. If a token exists, attach it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // 3. Send the modified request on its way
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;


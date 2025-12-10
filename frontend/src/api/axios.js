import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5050",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        return Promise.reject(error);
    }
);

export default api;

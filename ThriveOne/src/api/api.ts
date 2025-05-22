import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Use VITE_ prefix for Vite
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        // Add any custom logic before the request is sent
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            console.error('Response error:', error.response.data);
        } else if (error.request) {
            console.error('Request error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;

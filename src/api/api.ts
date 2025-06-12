import axios from 'axios';
import { useRequestStore } from '../store/useRequestStore'

const apiClient = axios.create({
    baseURL: (import.meta as any).env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async config => {
        const requestStore = useRequestStore();
        (config as any)._requestMethod = config.method?.toUpperCase();
        if (config.method && ['POST', 'PUT', 'DELETE'].includes(config.method.toUpperCase())) {
            requestStore.setSuccess(`Sending ${config.method.toUpperCase()} request to ${config.url}`); 
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    async response => {
        const requestStore = useRequestStore();
        const method = (response.config as any)._requestMethod;
        if (['POST', 'PUT', 'DELETE'].includes(method)) {
            requestStore.setSuccess(`Successfully completed your request.`);
        }
        return response.data;
    },
    async error => {
        const requestStore = useRequestStore();
        const method = (error.config as any)?._requestMethod;
        if (method) {
            requestStore.setError(
                (error.response?.data?.message || error.message || 'An unexpected error occurred.')
            );
        } else {
            requestStore.setError(
                error.response?.data?.message || error.message || 'An unexpected error occurred.'
            );
        }
        return Promise.reject(error);
    }
);

export default apiClient;

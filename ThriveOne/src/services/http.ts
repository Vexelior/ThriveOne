import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

http.interceptors.response.use(
  response => response,
  error => {
    // handle common error responses
    return Promise.reject(error);
  }
);

export default http;

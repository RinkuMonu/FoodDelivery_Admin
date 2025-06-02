// src/utils/axiosInstance.ts
import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4080', // Change to your API base URL
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});
    const token = localStorage.getItem('accessToken');
// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
console.log("tokennnnnnnnnnn",token)
// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: handle global errors like token expiration
    if (error.response?.status === 401) {
      // You can trigger logout or redirect here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

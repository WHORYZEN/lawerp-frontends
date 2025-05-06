
import axios from 'axios';

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with a status code outside 2xx range
      if (error.response.status === 401) {
        // Auth error, redirect to login
        localStorage.removeItem('auth_token');
        // Redirect to login can be added here if needed
      }
      
      if (error.response.status === 403) {
        // Permission denied
        console.error('Permission denied:', error.response.data);
      }
    } else if (error.request) {
      // Network error or no response received
      console.error('Network error:', error.request);
    } else {
      // Request error
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

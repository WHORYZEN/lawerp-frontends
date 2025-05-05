
import axios from 'axios';

// API base URL - will use the environment variable in production
// and default to localhost in development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response) {
      const { status } = error.response;
      
      // Auth errors
      if (status === 401) {
        // Redirect to login or refresh token
        console.error('Authentication error');
      }
      
      // Server errors
      if (status >= 500) {
        console.error('Server error occurred');
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

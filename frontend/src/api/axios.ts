import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  withCredentials: false, // Set to true if you move to cookie-based auth later
});

// Add access token to request headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token if access token has expired
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once and only for 401 responses
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${API.defaults.baseURL}/auth/token/refresh/`,
            { refresh: refreshToken }
          );

          const newAccessToken = res.data.access;
          localStorage.setItem('access', newAccessToken);

          // Update and retry the original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        } catch (err) {
          console.error('Refresh token expired or invalid', err);
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;

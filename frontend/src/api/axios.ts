import axios from 'axios';

/**
 * Axios instance configured for making API requests to the backend.
 *
 * - `baseURL`: The base URL for the backend API, which is dynamically set using the `VITE_BACKEND_URL` environment variable.
 *   If the environment variable is not defined, it defaults to `http://localhost:8000`.
 * - `withCredentials`: Enables sending cookies with requests, allowing for authentication and session management.
 *
 * This instance should be used for all API requests to ensure consistent configuration.
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  withCredentials: true, // This enables sending cookies!
});

export default API;
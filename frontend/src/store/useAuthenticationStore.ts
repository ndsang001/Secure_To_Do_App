/**
 * Authentication store for managing user authentication state and actions.
 * 
 * This store provides state management for user authentication, including login, 
 * registration, logout, and authentication status checks. It also handles CSRF token 
 * fetching and error management.
 * 
 * State:
 * - `authenticated`: Indicates whether the user is authenticated.
 * - `checkingAuth`: Indicates whether the authentication status is being checked.
 * - `error`: Stores any error messages related to authentication actions.
 * - `loading`: Indicates whether an authentication-related action is in progress.
 * 
 * Actions:
 * - `fetchCSRFToken`: Fetches the CSRF token required for secure API requests.
 * - `loginUser`: Logs in a user with the provided credentials.
 * - `registerUser`: Registers a new user with the provided data.
 * - `logoutUser`: Logs out the current user.
 * - `checkAuth`: Checks the current authentication status of the user.
 * - `clearError`: Clears any existing error messages in the store.
 * 
 * Error Handling:
 * - Errors during login and registration are captured and stored in the `error` state.
 * - Specific error messages are extracted from server responses when available.
 * 
 * Usage:
 * This store can be used in a React application to manage authentication state 
 * and actions using a state management library like Zustand.
 */

import { create } from "zustand";
import { login, register, logout as logoutAPI, fetchCSRFToken as fetchCSRFTokenAPI, refreshToken} from "../api/authentication";
import axios, { AxiosError } from "axios";

export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
  }

interface AuthState {
  authenticated: boolean;
  checkingAuth: boolean; // Indicates if the app is checking authentication status, leveraging token refresh to verify sessions.
  error: string;
  loading: boolean;
  loginUser: (data: LoginRequest) => Promise<void>;
  registerUser: (data: RegisterRequest) => Promise<void>;
  logoutUser: () => Promise<void>;
  clearError: () => void;
  fetchCSRFToken: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthenticationStore = create<AuthState>((set) => ({
    authenticated: false,
    checkingAuth: false,
    error: "",
    loading: false,

    fetchCSRFToken: async () => {
      try {
        await fetchCSRFTokenAPI();
      } catch (err) {
        console.error("Failed to fetch CSRF token:", err);
      }
    },

    loginUser: async (data: LoginRequest) => {
      set({ loading: true, error: "" });
    
      try {
        await login(data);
        set({ authenticated: true });
      } catch (err) {
        let message = "Login failed. Please try again.";
    
        if ((err as AxiosError<{ error: string }>)?.response?.status === 401) {
          const axiosError = err as AxiosError<{ error: string }>;
          message = axiosError.response?.data?.error || message;
        }
    
        set({ error: message });
      } finally {
        set({ loading: false });
      }
    },       

    registerUser: async (data: RegisterRequest) => {
      set({ loading: true, error: "" });
    
      try {
        await register(data);
      } catch (err) {
        let message = "Registration failed. Please try again.";
    
        if (axios.isAxiosError(err)) {
          const serverError = err.response?.data as { error?: string };
          if (serverError?.error) {
            message = serverError.error;
          }
        }
    
        set({ error: message });
        console.error("Registration error:", message);
        throw new Error(message); // Throw with actual message
      } finally {
        set({ loading: false });
      }
    },
    

    logoutUser: async () => {
      try {
        await logoutAPI();
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        set({ authenticated: false });
      }
    },

    checkAuth: async () => {
      set({ checkingAuth: true });
      try {
        await refreshToken();
        set({ authenticated: true });
      } catch (err) {
        set({ authenticated: false });
        console.warn("Auth check failed:", err);
      } finally {
        set({ checkingAuth: false });
      }
    },
  
    clearError: () => set({ error: "" }),
}));

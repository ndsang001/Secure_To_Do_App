import { create } from "zustand";
import { login, register, logout as logoutAPI, fetchCSRFToken as fetchCSRFTokenAPI} from "../api/authentication";
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
  error: string;
  loading: boolean;
  loginUser: (data: LoginRequest) => Promise<void>;
  registerUser: (data: RegisterRequest) => Promise<void>;
  logoutUser: () => Promise<void>;
  clearError: () => void;
  fetchCSRFToken: () => Promise<void>;
}

export const useAuthenticationStore = create<AuthState>((set) => ({
    authenticated: false,
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

    // registerUser: async (data: RegisterRequest) => {
    //   set({ loading: true, error: "" });
    
    //   try {
    //     await register(data);
    //   } catch (err) {
    //     let message = "Registration failed. Please try again.";
    
    //     if (axios.isAxiosError(err)) {
    //       const serverError = err.response?.data as { error?: string };
    //       if (serverError?.error) {
    //         message = serverError.error;
    //       }
    //     }
    //     console.error("Registration error:", err);
    //     set({ error: message });
    //     throw new Error(message);
    //   } finally {
    //     set({ loading: false });
    //   }
    // },

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
        throw new Error(message); // ✅ Throw with actual message
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
  
    clearError: () => set({ error: "" }),
}));

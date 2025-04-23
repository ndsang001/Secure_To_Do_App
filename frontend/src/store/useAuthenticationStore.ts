import { create } from "zustand";
import { login, register, logout as logoutAPI } from "../api/authentication";

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
}

export const useAuthenticationStore = create<AuthState>((set) => ({
    authenticated: false,
    error: "",
    loading: false,

    loginUser: async (data: LoginRequest) => {
        set({ loading: true, error: "" });

        try {
        await login(data);
        set({ authenticated: true});
        } catch (err: unknown) {
        const message =
            (err instanceof Error && err.message) ||
            "Login failed. Please try again.";
        set({ error: message });
        } finally {
        set({ loading: false });
        }
    },

    registerUser: async (data: RegisterRequest) => {
        set({ loading: true, error: "" });
    
        try {
          await register(data);
        } catch (err: unknown) {
          const message =
            (err instanceof Error && err.message) ||
            "Registration failed. Please try again.";
          set({ error: message });
          throw new Error(message);
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

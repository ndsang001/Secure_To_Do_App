import axios from "./axios";
import { LoginRequest, RegisterRequest } from "../store/useAuthenticationStore";

// Helper to get CSRF token from cookie
const getCookie = (name: string): string | undefined => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
};

// Fetches the CSRF token by making a GET request to the server.
// This sets the CSRF cookie required for subsequent requests.
export const fetchCSRFToken = async (): Promise<void> => {
  try {
    await axios.get("/auth/csrf/", { withCredentials: true });
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
};

// Refreshes the authentication token by making a POST request to the server.
// Requires the CSRF token to be included in the headers.
export const refreshToken = async (): Promise<void> => {
  await axios.post("/auth/refresh/", {}, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCookie("csrftoken") || "",
    },
  });
};

// Logs in the user by sending their credentials to the server.
// Requires the CSRF token to be included in the headers.
export const login = async (data: LoginRequest): Promise<void> => {
  await axios.post("/auth/login/", data, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCookie("csrftoken") || "",
    },
  });
};

// Registers a new user by sending their details to the server.
// Requires the CSRF token to be included in the headers.
export const register = async (data: RegisterRequest): Promise<void> => {
  await axios.post("/auth/register/", data, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCookie("csrftoken") || "",
    },
  });
};

// Logs out the user by making a POST request to the server.
// Requires the CSRF token to be included in the headers.
export const logout = async (): Promise<void> => {
  await axios.post("/auth/logout/", {}, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCookie("csrftoken") || "",
    },
  });
};
import axios from "./axios";
import { LoginRequest, RegisterRequest } from "../store/useAuthenticationStore";

// Helper to get CSRF token from cookie
const getCookie = (name: string): string | undefined => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
};

// GET /auth/csrf/ to set the CSRF cookie
export const fetchCSRFToken = async (): Promise<void> => {
  try {
    await axios.get("/auth/csrf/", { withCredentials: true });
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
};

// export const login = async (data: LoginRequest): Promise<void> => {
//   await axios.post("/auth/login/", data, {
//     withCredentials: true, // Important for cookies (access/refresh)
//   });
// };

// export const register = async (data: RegisterRequest): Promise<void> => {
//   await axios.post("/auth/register/", data, {
//     withCredentials: true, // optional, only needed if server uses cookies on register
//   });
// };

// export const logout = async () => {
//   await axios.post("/auth/logout/", {}, { withCredentials: true });
// };

export const login = async (data: LoginRequest): Promise<void> => {
  await axios.post("/auth/login/", data, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCookie("csrftoken") || "",
    },
  });
};

export const register = async (data: RegisterRequest): Promise<void> => {
  await axios.post("/auth/register/", data, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCookie("csrftoken") || "",
    },
  });
};

export const logout = async (): Promise<void> => {
  await axios.post("/auth/logout/", {}, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCookie("csrftoken") || "",
    },
  });
};
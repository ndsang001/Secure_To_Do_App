import axios from "./axios";
import { LoginRequest, RegisterRequest } from "../store/useAuthenticationStore";

export const login = async (data: LoginRequest): Promise<void> => {
  await axios.post("/auth/login/", data, {
    withCredentials: true, // Important for cookies (access/refresh)
  });
};

export const register = async (data: RegisterRequest): Promise<void> => {
  await axios.post("/auth/register/", data, {
    withCredentials: true, // optional, only needed if server uses cookies on register
  });
};

export const logout = async () => {
  await axios.post("/auth/logout/", {}, { withCredentials: true });
};
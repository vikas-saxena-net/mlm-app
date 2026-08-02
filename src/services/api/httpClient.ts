import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getStoredToken, clearStoredAuth, AUTH_UNAUTHORIZED_EVENT } from "../../utils/tokenStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export interface ApiErrorShape {
  status: number | null;
  message: string;
}

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? null;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    const isAuthAttempt =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/change-password");
    if (status === 401 && !isAuthAttempt) {
      clearStoredAuth();
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }

    const normalized: ApiErrorShape = { status, message };
    return Promise.reject(normalized);
  }
);

export default httpClient;

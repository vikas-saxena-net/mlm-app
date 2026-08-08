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

/** Shape the CRM API's own error responses take: either the standard
 *  ApiResponse envelope ({message, errors}) or ASP.NET's ProblemDetails
 *  ({title, detail}) — plus ASP.NET's built-in validation ProblemDetails,
 *  where `errors` is a field->messages map instead of a string array. */
interface KnownApiErrorBody {
  message?: string | null;
  title?: string | null;
  detail?: string | null;
  errors?: string[] | Record<string, string[]> | null;
}

function extractErrorMessage(error: AxiosError<KnownApiErrorBody>): string {
  const data = error.response?.data;

  if (data) {
    if (data.message) return data.message;

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.join(" ");
    }
    if (data.errors && !Array.isArray(data.errors)) {
      const flattened = Object.values(data.errors).flat();
      if (flattened.length > 0) return flattened.join(" ");
    }

    if (data.detail) return data.detail;
    if (data.title) return data.title;
  }

  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
    return "Unable to reach the server. Please check your connection and try again.";
  }

  return error.message || "Something went wrong. Please try again.";
}

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<KnownApiErrorBody>) => {
    const status = error.response?.status ?? null;
    const message = extractErrorMessage(error);

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

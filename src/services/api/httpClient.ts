import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
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

    const normalized: ApiErrorShape = { status, message };
    return Promise.reject(normalized);
  }
);

export default httpClient;

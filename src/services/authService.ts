import httpClient from "./api/httpClient";
import { unwrapApiResponse } from "../utils/apiResponse";
import type {
  AuthenticatedUserResponse,
  AuthenticatedUserResponseApiResponse,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
} from "../types/auth.types";
import type { ApiResponse } from "../types/registration.types";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await httpClient.post<LoginResponse>("/auth/login", credentials);
  return response.data;
}

export async function fetchCurrentUser(): Promise<AuthenticatedUserResponse> {
  const response = await httpClient.get<AuthenticatedUserResponseApiResponse>("/auth/me");
  return unwrapApiResponse(response.data);
}

export async function changePassword(payload: ChangePasswordRequest): Promise<unknown> {
  const response = await httpClient.post<ApiResponse<unknown>>("/auth/change-password", payload);
  return unwrapApiResponse(response.data);
}

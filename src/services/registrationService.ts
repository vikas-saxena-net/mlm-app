import httpClient from "./api/httpClient";
import { unwrapApiResponse } from "../utils/apiResponse";
import type {
  ApiResponse,
  CreateUserRegistrationRequest,
  StatusMainResponse,
  UpdateUserRegistrationRequest,
  UserRegistrationResponse,
} from "../types/registration.types";

export async function registerUser(payload: CreateUserRegistrationRequest): Promise<string | null> {
  const response = await httpClient.post<ApiResponse<string | null>>("/user-registration", payload);
  return unwrapApiResponse(response.data);
}

export async function updateUserRegistration(
  usersGuid: string,
  payload: UpdateUserRegistrationRequest
): Promise<unknown> {
  const response = await httpClient.put<ApiResponse<unknown>>(
    `/user-registration/${encodeURIComponent(usersGuid)}`,
    payload
  );
  return unwrapApiResponse(response.data);
}

export async function getUserProfile(usersGuid: string): Promise<UserRegistrationResponse> {
  const response = await httpClient.get<ApiResponse<UserRegistrationResponse>>(
    `/user-registration/editprofile/${encodeURIComponent(usersGuid)}`
  );
  return unwrapApiResponse(response.data);
}

export async function getUserStatuses(): Promise<StatusMainResponse[]> {
  const response = await httpClient.get<ApiResponse<StatusMainResponse[]>>("/user-registration/statuses");
  return unwrapApiResponse(response.data) ?? [];
}

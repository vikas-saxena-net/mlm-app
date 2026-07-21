import httpClient from "./api/httpClient";
import { unwrapApiResponse } from "../utils/apiResponse";
import type { ApiResponse, CreateUserRegistrationRequest } from "../types/registration.types";

export async function registerUser(payload: CreateUserRegistrationRequest): Promise<string | null> {
  const response = await httpClient.post<ApiResponse<string | null>>("/user-registration", payload);
  return unwrapApiResponse(response.data);
}

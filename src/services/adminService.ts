import httpClient from "./api/httpClient";
import { unwrapApiResponse } from "../utils/apiResponse";
import type { AdminUserListResponse, ApiResponse } from "../types/registration.types";

export async function getAllUsers(): Promise<AdminUserListResponse[]> {
  const response = await httpClient.get<ApiResponse<AdminUserListResponse[]>>("/admin/users");
  return unwrapApiResponse(response.data) ?? [];
}

export async function deleteUser(userGuid: string, updatedBy?: string): Promise<unknown> {
  const response = await httpClient.delete<ApiResponse<unknown>>(`/admin/users/${encodeURIComponent(userGuid)}`, {
    params: updatedBy ? { updated_by: updatedBy } : undefined,
  });
  return unwrapApiResponse(response.data);
}

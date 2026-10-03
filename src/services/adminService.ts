import httpClient from "./api/httpClient";
import { unwrapApiResponse } from "../utils/apiResponse";
import type {
  AdminUserListResponse,
  ApiResponse,
  UpdateGenealogyRequest,
  UpdateGenealogyResponse,
  UpdatePaymentRequest,
} from "../types/registration.types";

/** Places a member in the genealogy: sets their upline and Left/Right position, and assigns a user_code on first placement. Admin only. */
export async function updateGenealogy(
  usersGuid: string,
  payload: UpdateGenealogyRequest
): Promise<UpdateGenealogyResponse> {
  const response = await httpClient.put<ApiResponse<UpdateGenealogyResponse>>(
    `/admin/genealogy/${encodeURIComponent(usersGuid)}`,
    payload
  );
  return unwrapApiResponse(response.data);
}

export async function getAllUsers(statusGuid?: string): Promise<AdminUserListResponse[]> {
  const response = await httpClient.get<ApiResponse<AdminUserListResponse[]>>("/admin/users", {
    params: statusGuid ? { status_guid: statusGuid } : undefined,
  });
  return unwrapApiResponse(response.data) ?? [];
}

export async function deleteUser(userGuid: string, updatedBy?: string): Promise<unknown> {
  const response = await httpClient.delete<ApiResponse<unknown>>(`/admin/users/${encodeURIComponent(userGuid)}`, {
    params: updatedBy ? { updated_by: updatedBy } : undefined,
  });
  return unwrapApiResponse(response.data);
}

export async function updatePurchasePayment(mainId: number, payload: UpdatePaymentRequest): Promise<unknown> {
  const response = await httpClient.put<ApiResponse<unknown>>(
    `/admin/purchases/${encodeURIComponent(String(mainId))}/payment`,
    payload
  );
  return unwrapApiResponse(response.data);
}

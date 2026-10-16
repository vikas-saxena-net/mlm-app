import httpClient from "./api/httpClient";
import { unwrapApiResponse } from "../utils/apiResponse";
import type {
  AdminUserListResponse,
  ApiResponse,
  OpenUplineResponse,
  UpdateGenealogyRequest,
  UpdateGenealogyResponse,
  UpdatePaymentRequest,
} from "../types/registration.types";

/**
 * Placed members who still have a free Left and/or Right side: the upline choices for a member with no sponsor.
 * Pass the member being placed so they (and anyone beneath them) are left out. Admin only.
 */
export async function getOpenUplines(excludeUsersGuid?: string): Promise<OpenUplineResponse[]> {
  const response = await httpClient.get<ApiResponse<OpenUplineResponse[]>>("/admin/genealogy/open-slots", {
    params: excludeUsersGuid ? { exclude_users_guid: excludeUsersGuid } : undefined,
  });
  return unwrapApiResponse(response.data) ?? [];
}

/** Places a member in the genealogy: sets their upline and Left/Right position, and assigns a user_code on first placement. Admin only. */
export async function updateGenealogy(
  usersGuid: string,
  payload: UpdateGenealogyRequest
): Promise<UpdateGenealogyResponse> {
  // POST .../update instead of PUT: the production server's firewall blocks PUT and DELETE.
  const response = await httpClient.post<ApiResponse<UpdateGenealogyResponse>>(
    `/admin/genealogy/${encodeURIComponent(usersGuid)}/update`,
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
  const response = await httpClient.post<ApiResponse<unknown>>(
    `/admin/users/${encodeURIComponent(userGuid)}/delete`,
    undefined,
    { params: updatedBy ? { updated_by: updatedBy } : undefined }
  );
  return unwrapApiResponse(response.data);
}

export async function updatePurchasePayment(mainId: number, payload: UpdatePaymentRequest): Promise<unknown> {
  const response = await httpClient.post<ApiResponse<unknown>>(
    `/admin/purchases/${encodeURIComponent(String(mainId))}/payment/update`,
    payload
  );
  return unwrapApiResponse(response.data);
}

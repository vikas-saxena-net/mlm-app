import httpClient from "./api/httpClient";
import { unwrapApiResponse } from "../utils/apiResponse";
import type {
  ApiResponse,
  CheckoutRequest,
  CheckoutResponse,
  CreateUserRegistrationRequest,
  PurchaseItemResponse,
  PurchaseOrderResponse,
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

export async function checkout(payload: CheckoutRequest): Promise<CheckoutResponse> {
  const response = await httpClient.post<ApiResponse<CheckoutResponse>>("/user-registration/checkout", payload);
  return unwrapApiResponse(response.data);
}

export async function getPurchases(usersGuid?: string): Promise<PurchaseOrderResponse[]> {
  const response = await httpClient.get<ApiResponse<PurchaseOrderResponse[]>>("/user-registration/purchases", {
    params: usersGuid ? { users_guid: usersGuid } : undefined,
  });
  return unwrapApiResponse(response.data) ?? [];
}

export async function getPurchaseItems(mainId: number): Promise<PurchaseItemResponse[]> {
  const response = await httpClient.get<ApiResponse<PurchaseItemResponse[]>>(
    `/user-registration/purchases/${encodeURIComponent(String(mainId))}`
  );
  return unwrapApiResponse(response.data) ?? [];
}

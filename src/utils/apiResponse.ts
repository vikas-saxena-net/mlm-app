import type { ApiResponse } from "../types/registration.types";
import type { ApiErrorShape } from "../services/api/httpClient";

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    const message = response.errors?.filter(Boolean).join(", ") || response.message || "Request failed.";
    const error: ApiErrorShape = { status: 200, message };
    throw error;
  }
  return response.data;
}

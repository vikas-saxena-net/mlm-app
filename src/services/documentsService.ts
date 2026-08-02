import httpClient from "./api/httpClient";
import { unwrapApiResponse } from "../utils/apiResponse";
import type { ApiResponse, UploadDocumentsResponse } from "../types/registration.types";

export interface UploadDocumentsPayload {
  usersGuid: string;
  roleGuid: string;
  aadharFront?: File | null;
  aadharBack?: File | null;
  pancard?: File | null;
}

export async function uploadDocuments(payload: UploadDocumentsPayload): Promise<UploadDocumentsResponse> {
  const formData = new FormData();
  formData.append("users_guid", payload.usersGuid);
  formData.append("role_guid", payload.roleGuid);
  if (payload.aadharFront) formData.append("aadhar_front", payload.aadharFront);
  if (payload.aadharBack) formData.append("aadhar_back", payload.aadharBack);
  if (payload.pancard) formData.append("pancard", payload.pancard);

  const response = await httpClient.post<ApiResponse<UploadDocumentsResponse>>(
    "/users/upload-documents",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return unwrapApiResponse(response.data);
}

/** Resolves a document path returned by the API into an openable URL. */
export function resolveDocumentUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  const origin = apiBase.replace(/\/api\/?$/, "");
  return `${origin}/${path.replace(/^\//, "")}`;
}

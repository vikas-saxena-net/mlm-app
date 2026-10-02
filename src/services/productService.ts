import httpClient from "./api/httpClient";
import { unwrapApiResponse } from "../utils/apiResponse";
import type { ApiResponse, ProductResponse, UpdateProductRequest } from "../types/registration.types";

export async function getAllProducts(): Promise<ProductResponse[]> {
  const response = await httpClient.get<ApiResponse<ProductResponse[]>>("/shared/products");
  return unwrapApiResponse(response.data) ?? [];
}

export async function updateProduct(guid: string, payload: UpdateProductRequest): Promise<unknown> {
  const response = await httpClient.put<ApiResponse<unknown>>(
    `/products/${encodeURIComponent(guid)}`,
    payload
  );
  return unwrapApiResponse(response.data);
}

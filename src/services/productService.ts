import httpClient from "./api/httpClient";
import { unwrapApiResponse } from "../utils/apiResponse";
import type { ApiResponse, CreateProductRequest, ProductResponse, UpdateProductRequest } from "../types/registration.types";

export async function getAllProducts(): Promise<ProductResponse[]> {
  const response = await httpClient.get<ApiResponse<ProductResponse[]>>("/shared/products");
  return unwrapApiResponse(response.data) ?? [];
}

/** Adds a new product (admin only). Resolves with the new product's guid. */
export async function createProduct(payload: CreateProductRequest): Promise<string> {
  const response = await httpClient.post<ApiResponse<string>>("/products", payload);
  return unwrapApiResponse(response.data);
}

/**
 * Uploads a product image (JPG, JPEG or PNG, up to the API's size limit; admin only). Resolves with the stored
 * path (e.g. "/uploads/product_ab12....png") to put in the product's image field.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const response = await httpClient.post<ApiResponse<string>>("/products/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapApiResponse(response.data);
}

export async function updateProduct(guid: string, payload: UpdateProductRequest): Promise<unknown> {
  // POST .../update instead of PUT: the production server's firewall blocks PUT and DELETE.
  const response = await httpClient.post<ApiResponse<unknown>>(
    `/products/${encodeURIComponent(guid)}/update`,
    payload
  );
  return unwrapApiResponse(response.data);
}

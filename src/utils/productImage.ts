import { resolveDocumentUrl } from "../services/documentsService";

/**
 * Turns a product's stored image value into something an <img> can load.
 * - A full web address is used as is.
 * - "/uploads/..." files were uploaded through the API, so they are served by the API host (in development
 *   Vite proxies the same path to it).
 * - Anything else (e.g. "/products/regen-kaya-juice.png") is a file bundled with the website itself.
 */
export function resolveProductImageUrl(image: string | null | undefined): string {
  if (!image) return "";
  if (image.startsWith("/uploads/")) return resolveDocumentUrl(image);
  return image;
}

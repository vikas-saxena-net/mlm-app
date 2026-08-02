import type { ApiResponse } from "./registration.types";

/** POST /api/auth/login request body */
export interface LoginRequest {
  user_name: string;
  user_password: string;
}

/** Shape of the "user" object embedded in LoginResponse and returned by /api/auth/me */
export interface AuthenticatedUserResponse {
  user_guid: string | null;
  user_name: string | null;
  role_guid: string | null;
  role_name: string | null;
}

/** POST /api/auth/login response (not wrapped in the standard ApiResponse envelope) */
export interface LoginResponse {
  success: boolean;
  message: string | null;
  token: string | null;
  user: AuthenticatedUserResponse | null;
}

/** POST /api/auth/change-password request body */
export interface ChangePasswordRequest {
  user_name: string;
  current_password: string;
  new_password: string;
}

export type AuthenticatedUserResponseApiResponse = ApiResponse<AuthenticatedUserResponse>;

export const ROLE_GUID = {
  ADMIN: "273782ae-8430-11f1-94d8-9a1418d9f974",
  USER: "4600d4b0-8430-11f1-94d8-9a1418d9f974",
} as const;

export type RoleName = "admin" | "user";

export function roleNameFromGuid(roleGuid: string | null | undefined): RoleName | null {
  if (roleGuid === ROLE_GUID.ADMIN) return "admin";
  if (roleGuid === ROLE_GUID.USER) return "user";
  return null;
}

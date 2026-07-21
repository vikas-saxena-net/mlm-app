export type Gender = "Male" | "Female" | "Other";

export const GENDER_OPTIONS: Gender[] = ["Male", "Female", "Other"];

/** Generic envelope every CRM API endpoint responds with. */
export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors: string[] | null;
}

/** Shape of GET /api/shared/getuserdetails/{userCode} -> data */
export interface UserDetailsResponse {
  userCode: string | null;
  usersGuid: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  emailId: string | null;
  mobileNumber: number;
}

export type DuplicateCheckField = "userName" | "emailId" | "mobileNumber";

/** Shape of GET /api/shared/check-duplicate -> data */
export interface DuplicateCheckResponse {
  userNameExists: boolean | null;
  emailExists: boolean | null;
  mobileNumberExists: boolean | null;
}

/** Shared shape for Country/State/City API responses. */
export interface LookupOption {
  id: string;
  name: string;
}

export interface RawLookupItem {
  guid: string;
  name: string | null;
  code: string | null;
}

/** Maps 1:1 to CreateUserRegistrationRequest on the API. */
export interface CreateUserRegistrationRequest {
  userName: string;
  userPassword: string;
  sponsorGuid?: string;
  position?: string;
  userFirstName: string;
  userLastName: string;
  emailId: string;
  emailVerify: boolean;
  mobileNumber: number;
  mobileVerify?: boolean;
  gender: string;
  dob: string;
  fatherName: string;
  address1?: string;
  address2?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  updatedBy?: string;
}

export interface DuplicateFieldState {
  checking: boolean;
  isDuplicate: boolean | null;
  message: string;
}

export interface SponsorVerificationState {
  verifying: boolean;
  verified: boolean;
  sponsorGuid: string | null;
  sponsorName: string | null;
  error: string | null;
}

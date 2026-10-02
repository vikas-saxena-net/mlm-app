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

export interface StateListItem {
  guid: string;
  name: string | null;
  code: string | null;
  countryGuid: string;
}

export interface CityListItem {
  guid: string;
  name: string | null;
  code: string | null;
  stateGuid: string;
}

export interface CreateStateRequest {
  name: string;
  code?: string;
  countryGuid: string;
}

export interface CreateCityRequest {
  name: string;
  code?: string;
  stateGuid: string;
}

/** Shape of GET /api/shared/products -> data (one item per product) */
export interface ProductResponse {
  productGuid: string;
  productCode: string | null;
  name: string | null;
  category: string | null;
  size: string | null;
  image: string | null;
  dpValue: number;
  bvValue: number;
  description: string | null;
  benefits: string[] | null;
  usage: string[] | null;
  status: number;
  createdDate: string;
  updatedDate: string;
  updatedBy: string | null;
}

/** Maps 1:1 to UpdateProductRequest on the API — PUT /api/products/{guid} */
export interface UpdateProductRequest {
  productCode: string;
  name: string;
  category?: string;
  size?: string;
  image?: string;
  dpValue: number;
  bvValue: number;
  description?: string;
  benefits?: string[];
  usage?: string[];
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
  aadhar: string;
  pancard?: string;
  address1?: string;
  address2?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  updatedBy?: string;
  role_guid: string;
  status_guid: string;
}

/** Maps 1:1 to UpdateUserRegistrationRequest on the API — PUT /api/user-registration/{usersGuid} */
export interface UpdateUserRegistrationRequest {
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
  aadhar?: string;
  pancard?: string;
  address1?: string;
  address2?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  updatedBy?: string;
  role_guid?: string;
  status_guid?: string;
}

/** Sponsor block returned inside GET /api/user-registration/editprofile/{usersGuid} (note the API's "sponser_guid" spelling) */
export interface SponsorDetailsResponse {
  sponser_guid: string | null;
  user_code: string | null;
  user_first_name: string | null;
  user_last_name: string | null;
  email_id: string | null;
  mobile_number: number;
}

/** Shape of GET /api/user-registration/editprofile/{usersGuid} -> data */
export interface UserRegistrationResponse {
  usersGuid: string | null;
  userName: string | null;
  sponsorGuid: string | null;
  sponsor: SponsorDetailsResponse | null;
  position: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  emailId: string | null;
  emailVerify: boolean;
  mobileNumber: number;
  mobileVerify: boolean;
  gender: string | null;
  dob: string;
  fatherName: string | null;
  address1: string | null;
  address2: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  pincode: string | null;
  status: string | null;
  role_guid: string | null;
  status_guid: string | null;
  aadhar: string | null;
  aadhar_front: string | null;
  aadhar_back: string | null;
  pancard: string | null;
  pancard_url: string | null;
  updatedBy: string | null;
  createdDate: string;
  updatedDate: string;
}

/** Shape of POST /api/users/upload-documents -> data */
export interface UploadDocumentsResponse {
  user_name: string | null;
  aadhar_front: string | null;
  aadhar_back: string | null;
  pancard_url: string | null;
}

/** Shape of GET /api/user-registration/statuses -> data (one item per status) */
export interface StatusMainResponse {
  status_guid: string | null;
  code: string | null;
  name: string | null;
  description: string | null;
  sequence: number;
}

/** Shape of GET /api/admin/users -> data (one item per user) */
export interface AdminUserListResponse {
  usersGuid: string | null;
  userName: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  emailId: string | null;
  mobileNumber: number;
  status: string | null;
  status_name: string | null;
  role_guid: string | null;
  role_name: string | null;
  createdDate: string;
  updatedDate: string;
  createdBy: string | null;
  updatedBy: string | null;
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

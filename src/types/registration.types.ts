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
  user_name: string;
  /** Numeric code assigned when the sponsor was placed in the genealogy; null if they have none. */
  user_code: number | null;
  user_first_name: string | null;
  user_last_name: string | null;
  email_id: string | null;
  mobile_number: number;
}

/** Upline block returned inside GET /api/user-registration/editprofile/{usersGuid}. Unlike the sponsor block, user_name and the numeric user_code are separate fields. */
export interface UplinerDetailsResponse {
  upliner_guid: string;
  user_name: string;
  /** Numeric code assigned when the upline was placed in the genealogy; null if they have none. */
  user_code: number | null;
  user_first_name: string | null;
  user_last_name: string | null;
  email_id: string | null;
  mobile_number: number;
}

/** One descendant in GET /api/shared/downline/{sponserGuid} -> data.members (flat; build the tree from upliner_guid) */
export interface DownlineMemberResponse {
  users_guid: string;
  user_name: string;
  /** Numeric code assigned when the member was placed in the genealogy. */
  user_code: number | null;
  mobile_number: number;
  user_first_name: string | null;
  user_last_name: string | null;
  /** users_guid of this member's upline (parent in the tree). */
  upliner_guid: string;
  position: string | null;
  /** 1 = directly under the requested user, 2 = one level further down, and so on. */
  level: number;
}

/** Shape of GET /api/shared/downline/{sponserGuid} -> data (the user plus everyone beneath them). Login required; admin may request any user. */
export interface DownlineResponse {
  users_guid: string;
  user_name: string;
  user_code: number | null;
  mobile_number: number;
  /** users_guid of this user's own upline (one level up); null at the top of the tree or when not placed. */
  upliner_guid: string | null;
  user_first_name: string | null;
  user_last_name: string | null;
  total_members: number;
  members: DownlineMemberResponse[];
}

/** Shape of GET /api/user-registration/editprofile/{usersGuid} -> data */
export interface UserRegistrationResponse {
  usersGuid: string | null;
  userName: string | null;
  sponsorGuid: string | null;
  sponsor: SponsorDetailsResponse | null;
  /** users_guid of this member's upline; null until they are placed in the genealogy. */
  upliner_guid: string | null;
  upliner: UplinerDetailsResponse | null;
  /** This member's own numeric user code; null until they are placed. */
  user_code: number | null;
  /** "Left" or "Right": the side under the upline. */
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

/** One cart line inside POST /api/user-registration/checkout */
export interface CheckoutDetailRequest {
  product_guid: string;
  quantity: number;
  /** Unit price — the API validates total_amount == sum(quantity x amount). */
  amount: number;
}

/** Body of POST /api/user-registration/checkout */
export interface CheckoutRequest {
  users_guid: string;
  total_amount: number;
  payment_mode: string;
  user_remark?: string;
  details: CheckoutDetailRequest[];
}

/** Shape of POST /api/user-registration/checkout -> data */
export interface CheckoutResponse {
  id: number;
  users_guid: string | null;
  total_amount: number;
  payment_mode: string | null;
  payment_status_guid: string | null;
  item_count: number;
}

/** Shape of POST /api/payments/razorpay/order -> data (everything needed to open Razorpay Checkout) */
export interface RazorpayOrderResponse {
  main_id: number;
  key_id: string;
  razorpay_order_id: string;
  /** Amount in paise. */
  amount: number;
  currency: string;
  merchant_name: string;
  description: string;
  prefill_name: string | null;
  prefill_email: string | null;
  prefill_contact: string | null;
}

/** Body of POST /api/payments/razorpay/verify - the values Razorpay Checkout returns after payment. */
export interface VerifyRazorpayPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/** Shape of POST /api/payments/razorpay/verify -> data */
export interface VerifyRazorpayPaymentResponse {
  main_id: number;
  razorpay_payment_id: string;
  payment_status_guid: string;
  total_amount: number;
  user_status_guid: string | null;
  user_status_updated: boolean;
}

/** Body of PUT /api/admin/genealogy/{usersGuid} */
export interface UpdateGenealogyRequest {
  /** users_guid of the chosen upline. */
  upliner_guid: string;
  /** "Left" or "Right". */
  position: string;
}

/** Shape of PUT /api/admin/genealogy/{usersGuid} -> data */
export interface UpdateGenealogyResponse {
  users_guid: string;
  upliner_guid: string;
  position: string;
  user_code: number;
  /** True when this call assigned the user_code (the member's first placement). */
  user_code_assigned: boolean;
}

/** Body of PUT /api/admin/purchases/{mainId}/payment */
export interface UpdatePaymentRequest {
  /** The order owner's users_guid (PurchaseOrderResponse.users_guid) - NOT the logged-in admin's guid. */
  users_guid: string;
  payment_status_guid: string;
  admin_remark: string;
  approval_date: string;
}

/** Shape of GET /api/shared/payment-statuses -> data (one item per payment status) */
export interface PaymentStatusResponse {
  status_guid: string | null;
  code: string | null;
  name: string | null;
  description: string | null;
  sequence: number;
}

/** Shape of GET /api/user-registration/purchases -> data (one item per order) */
export interface PurchaseOrderResponse {
  main_id: number;
  users_guid: string | null;
  user_name: string | null;
  user_first_name: string | null;
  user_last_name: string | null;
  email_id: string | null;
  mobile_number: number;
  total_amount: number;
  payment_mode: string | null;
  payment_status_guid: string | null;
  payment_status_code: string | null;
  payment_status_name: string | null;
  user_remark: string | null;
  admin_remark: string | null;
  approval_date: string | null;
  created_date: string;
  item_count: number;
}

/** Shape of GET /api/user-registration/purchases/{mainId} -> data (one item per order line) */
export interface PurchaseItemResponse {
  id: number;
  main_id: number;
  product_guid: string | null;
  product_code: string | null;
  name: string | null;
  category: string | null;
  size: string | null;
  image: string | null;
  description: string | null;
  dp_value: number;
  bv_value: number;
  quantity: number;
  /** Unit price. */
  amount: number;
  line_total: number;
  created_date: string;
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
  /** Numeric code assigned when the member is placed in the genealogy; null until then. */
  user_code?: number | null;
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

import type { CreateUserRegistrationRequest } from "../types/registration.types";
import type { RegistrationSchemaType } from "../validation/registrationSchema";

// Fixed defaults applied to every new self-registration.
const DEFAULT_ROLE_GUID = "4600d4b0-8430-11f1-94d8-9a1418d9f974";
const DEFAULT_STATUS_GUID = "c11c8929-86c0-11f1-9528-000c296e9a77";

export function mapToRegistrationPayload(
  formValues: RegistrationSchemaType,
  sponsorGuid?: string
): CreateUserRegistrationRequest {
  return {
    userName: formValues.username.trim(),
    userPassword: formValues.password,
    sponsorGuid: sponsorGuid || undefined,
    userFirstName: formValues.firstName.trim(),
    userLastName: formValues.lastName.trim(),
    emailId: formValues.email.trim(),
    emailVerify: false,
    mobileNumber: Number(formValues.mobileNumber.trim()),
    mobileVerify: false,
    gender: formValues.gender,
    dob: formValues.dob,
    fatherName: formValues.fatherName.trim(),
    address1: formValues.address1?.trim() || undefined,
    address2: formValues.address2?.trim() || undefined,
    country: formValues.country || undefined,
    state: formValues.state || undefined,
    city: formValues.city || undefined,
    pincode: formValues.pincode?.trim() || undefined,
    role_guid: DEFAULT_ROLE_GUID,
    status_guid: DEFAULT_STATUS_GUID,
  };
}

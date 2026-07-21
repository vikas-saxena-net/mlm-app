import type { CreateUserRegistrationRequest } from "../types/registration.types";
import type { RegistrationSchemaType } from "../validation/registrationSchema";

export function mapToRegistrationPayload(
  formValues: RegistrationSchemaType,
  sponsorGuid: string
): CreateUserRegistrationRequest {
  return {
    userName: formValues.username.trim(),
    userPassword: formValues.password,
    sponsorGuid,
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
  };
}

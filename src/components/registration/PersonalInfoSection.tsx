import type { UseFormRegister, FieldErrors } from "react-hook-form";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import FieldStatusIcon from "../form/FieldStatusIcon";
import SectionCard from "../form/SectionCard";
import type { RegistrationSchemaType } from "../../validation/registrationSchema";
import type { DuplicateFieldState, LookupOption } from "../../types/registration.types";

const GENDER_SELECT_OPTIONS: LookupOption[] = [
  { id: "Male", name: "Male" },
  { id: "Female", name: "Female" },
  { id: "Other", name: "Other" },
];

interface PersonalInfoSectionProps {
  register: UseFormRegister<RegistrationSchemaType>;
  errors: FieldErrors<RegistrationSchemaType>;
  maxDob: string;
  usernameStatus: DuplicateFieldState;
  emailStatus: DuplicateFieldState;
  mobileStatus: DuplicateFieldState;
  onUsernameChange: (value: string) => void;
  onUsernameBlur: (value: string) => void;
  onEmailBlur: (value: string) => void;
  onMobileBlur: (value: string) => void;
}

export default function PersonalInfoSection({
  register,
  errors,
  maxDob,
  usernameStatus,
  emailStatus,
  mobileStatus,
  onUsernameChange,
  onUsernameBlur,
  onEmailBlur,
  onMobileBlur,
}: PersonalInfoSectionProps) {
  const usernameField = register("username");
  const emailField = register("email");
  const mobileField = register("mobileNumber");

  return (
    <SectionCard step={2} title="Personal Information" subtitle="All fields in this section are required">
      <FormInput
        label="Username"
        required
        placeholder="Choose a username"
        error={
          errors.username?.message ||
          (usernameStatus.isDuplicate ? usernameStatus.message : undefined)
        }
        hint={!errors.username && usernameStatus.isDuplicate === false ? usernameStatus.message : undefined}
        statusSlot={<FieldStatusIcon status={usernameStatus} />}
        {...usernameField}
        onChange={(e) => {
          usernameField.onChange(e);
          onUsernameChange(e.target.value);
        }}
        onBlur={(e) => {
          usernameField.onBlur(e);
          onUsernameBlur(e.target.value);
        }}
      />

      <FormInput
        label="Father's Name"
        required
        placeholder="Enter father's name"
        error={errors.fatherName?.message}
        {...register("fatherName")}
      />

      <FormInput
        label="Password"
        type="password"
        required
        placeholder="Create a password"
        error={errors.password?.message}
        hint="Min 8 characters with uppercase, lowercase & a number"
        {...register("password")}
      />

      <FormInput
        label="Confirm Password"
        type="password"
        required
        placeholder="Re-enter your password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <FormInput
        label="First Name"
        required
        placeholder="Enter first name"
        error={errors.firstName?.message}
        {...register("firstName")}
      />

      <FormInput
        label="Last Name"
        required
        placeholder="Enter last name"
        error={errors.lastName?.message}
        {...register("lastName")}
      />

      <FormInput
        label="Email"
        type="email"
        required
        placeholder="you@example.com"
        error={errors.email?.message || (emailStatus.isDuplicate ? emailStatus.message : undefined)}
        hint={!errors.email && emailStatus.isDuplicate === false ? emailStatus.message : undefined}
        statusSlot={<FieldStatusIcon status={emailStatus} />}
        {...emailField}
        onBlur={(e) => {
          emailField.onBlur(e);
          onEmailBlur(e.target.value);
        }}
      />

      <FormInput
        label="Mobile Number"
        type="tel"
        required
        placeholder="10-digit mobile number"
        maxLength={10}
        error={
          errors.mobileNumber?.message || (mobileStatus.isDuplicate ? mobileStatus.message : undefined)
        }
        hint={!errors.mobileNumber && mobileStatus.isDuplicate === false ? mobileStatus.message : undefined}
        statusSlot={<FieldStatusIcon status={mobileStatus} />}
        {...mobileField}
        onBlur={(e) => {
          mobileField.onBlur(e);
          onMobileBlur(e.target.value);
        }}
      />

      <FormSelect
        label="Gender"
        required
        options={GENDER_SELECT_OPTIONS}
        error={errors.gender?.message}
        {...register("gender")}
      />

      <FormInput
        label="Date of Birth"
        type="date"
        required
        max={maxDob}
        error={errors.dob?.message}
        hint="You must be at least 18 years old"
        {...register("dob")}
      />
    </SectionCard>
  );
}

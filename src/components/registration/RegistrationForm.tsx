import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SponsorSection from "./SponsorSection";
import PersonalInfoSection from "./PersonalInfoSection";
import AddressSection from "./AddressSection";
import RegistrationSuccess from "./RegistrationSuccess";
import Spinner from "../common/Spinner";
import Icon from "../Icon";
import {
  registrationSchema,
  isEmailFormatValid,
  isMobileFormatValid,
  isUsernameFormatValid,
  type RegistrationSchemaType,
} from "../../validation/registrationSchema";
import { useSponsorVerification } from "../../hooks/useSponsorVerification";
import { useDuplicateCheck } from "../../hooks/useDuplicateCheck";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { registerUser } from "../../services/registrationService";
import { mapToRegistrationPayload } from "../../utils/mapRegistrationPayload";
import { getMaxDobForMinAge } from "../../utils/date";
import type { ApiErrorShape } from "../../services/api/httpClient";

const MAX_DOB = getMaxDobForMinAge(18);

const defaultValues: RegistrationSchemaType = {
  sponsorId: "",
  username: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  gender: "",
  dob: "",
  fatherName: "",
  address1: "",
  address2: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
};

export default function RegistrationForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredUsername, setRegisteredUsername] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RegistrationSchemaType>({
    resolver: zodResolver(registrationSchema),
    defaultValues,
    mode: "onBlur",
  });

  const sponsor = useSponsorVerification();
  const usernameDup = useDuplicateCheck({
    field: "userName",
    isFormatValid: isUsernameFormatValid,
    label: "Username",
  });
  const emailDup = useDuplicateCheck({
    field: "emailId",
    isFormatValid: isEmailFormatValid,
    label: "Email",
  });
  const mobileDup = useDuplicateCheck({
    field: "mobileNumber",
    isFormatValid: isMobileFormatValid,
    label: "Mobile number",
  });

  const debouncedUsernameCheck = useDebouncedCallback(usernameDup.check, 500);

  const countryId = watch("country");
  const stateId = watch("state");

  const handleVerifySponsor = async (sponsorId: string) => {
    const success = await sponsor.verify(sponsorId);
    if (!success) {
      setValue("sponsorId", "");
    }
  };

  const onSubmit = async (values: RegistrationSchemaType) => {
    if (!sponsor.state.verified || !sponsor.state.sponsorGuid) {
      toast.error("Please verify a valid Sponsor ID before submitting.");
      return;
    }
    if (usernameDup.status.isDuplicate) {
      toast.error("Please choose a different username.");
      return;
    }
    if (emailDup.status.isDuplicate) {
      toast.error("This email is already registered.");
      return;
    }
    if (mobileDup.status.isDuplicate) {
      toast.error("This mobile number is already registered.");
      return;
    }

    setIsRegistering(true);
    try {
      const payload = mapToRegistrationPayload(values, sponsor.state.sponsorGuid);
      await registerUser(payload);
      toast.success("Registration successful!");
      setRegisteredUsername(values.username);
      setIsSuccess(true);
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleRegisterAnother = () => {
    reset(defaultValues);
    sponsor.reset();
    usernameDup.reset();
    emailDup.reset();
    mobileDup.reset();
    setIsSuccess(false);
    setRegisteredUsername("");
  };

  if (isSuccess) {
    return <RegistrationSuccess username={registeredUsername} onRegisterAnother={handleRegisterAnother} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <SponsorSection
        register={register}
        errors={errors}
        sponsorState={sponsor.state}
        onVerify={handleVerifySponsor}
        onManualChange={sponsor.reset}
      />

      <PersonalInfoSection
        register={register}
        errors={errors}
        maxDob={MAX_DOB}
        usernameStatus={usernameDup.status}
        emailStatus={emailDup.status}
        mobileStatus={mobileDup.status}
        onUsernameChange={debouncedUsernameCheck}
        onUsernameBlur={usernameDup.check}
        onEmailBlur={emailDup.check}
        onMobileBlur={mobileDup.check}
      />

      <AddressSection
        register={register}
        errors={errors}
        countryId={countryId}
        stateId={stateId}
        onCountryChange={() => {
          setValue("state", "");
          setValue("city", "");
        }}
        onStateChange={() => setValue("city", "")}
      />

      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isRegistering}
          className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-brand-orange px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isRegistering ? (
            <>
              <Spinner className="w-4 h-4" />
              Registering...
            </>
          ) : (
            <>
              Register
              <Icon name="arrowRight" className="w-4 h-4" />
            </>
          )}
        </button>
        <p className="text-xs text-slate-400">By registering, you agree to our terms and conditions.</p>
      </div>
    </form>
  );
}

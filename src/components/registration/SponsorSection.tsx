import type { UseFormRegister, FieldErrors } from "react-hook-form";
import FormInput from "../form/FormInput";
import Spinner from "../common/Spinner";
import Icon from "../Icon";
import SectionCard from "../form/SectionCard";
import type { RegistrationSchemaType } from "../../validation/registrationSchema";
import type { SponsorVerificationState } from "../../types/registration.types";

interface SponsorSectionProps {
  register: UseFormRegister<RegistrationSchemaType>;
  errors: FieldErrors<RegistrationSchemaType>;
  sponsorState: SponsorVerificationState;
  onVerify: (sponsorId: string) => void;
  onManualChange: () => void;
}

export default function SponsorSection({
  register,
  errors,
  sponsorState,
  onVerify,
  onManualChange,
}: SponsorSectionProps) {
  const sponsorIdField = register("sponsorId", {
    onBlur: (e) => onVerify(e.target.value),
  });

  return (
    <SectionCard step={1} title="Sponsor Information" subtitle="Enter the referring member's Sponsor ID">
      <div className="sm:col-span-2 sm:max-w-sm">
        <FormInput
          label="Sponsor ID"
          required
          placeholder="Enter Sponsor ID"
          error={sponsorState.error || errors.sponsorId?.message}
          {...sponsorIdField}
          onChange={(e) => {
            sponsorIdField.onChange(e);
            onManualChange();
          }}
          statusSlot={
            sponsorState.verifying ? (
              <Spinner className="w-4 h-4 text-slate-400" />
            ) : sponsorState.verified ? (
              <Icon name="check" className="w-4 h-4 text-brand-green" />
            ) : null
          }
        />

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("sponsorId") as HTMLInputElement | null;
              onVerify(input?.value ?? "");
            }}
            className="rounded-full border border-brand-green px-4 py-1.5 text-xs font-bold text-brand-green transition hover:bg-brand-green hover:text-white"
          >
            Verify Sponsor
          </button>
          {sponsorState.verified && sponsorState.sponsorName && (
            <span className="text-xs font-semibold text-brand-green">
              Sponsor Name: {sponsorState.sponsorName}
            </span>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

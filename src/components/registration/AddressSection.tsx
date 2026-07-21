import type { UseFormRegister, FieldErrors } from "react-hook-form";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import SectionCard from "../form/SectionCard";
import { useLocationData } from "../../hooks/useLocationData";
import type { RegistrationSchemaType } from "../../validation/registrationSchema";

interface AddressSectionProps {
  register: UseFormRegister<RegistrationSchemaType>;
  errors: FieldErrors<RegistrationSchemaType>;
  countryId: string;
  stateId: string;
  onCountryChange: () => void;
  onStateChange: () => void;
}

export default function AddressSection({
  register,
  errors,
  countryId,
  stateId,
  onCountryChange,
  onStateChange,
}: AddressSectionProps) {
  const { countries, states, cities, loadingStates, loadingCities } = useLocationData(countryId, stateId);

  const countryField = register("country");
  const stateField = register("state");

  return (
    <SectionCard step={3} title="Address Details" subtitle="Optional — you can add this later" optional>
      <FormInput
        label="Address Line 1"
        placeholder="House no, street"
        error={errors.address1?.message}
        {...register("address1")}
      />
      <FormInput
        label="Address Line 2"
        placeholder="Locality, landmark"
        error={errors.address2?.message}
        {...register("address2")}
      />

      <FormSelect
        label="Country"
        options={countries}
        placeholder="Select country"
        error={errors.country?.message}
        {...countryField}
        onChange={(e) => {
          countryField.onChange(e);
          onCountryChange();
        }}
      />

      <FormSelect
        label="State"
        options={states}
        placeholder={loadingStates ? "Loading states..." : "Select state"}
        disabled={!countryId || loadingStates}
        error={errors.state?.message}
        {...stateField}
        onChange={(e) => {
          stateField.onChange(e);
          onStateChange();
        }}
      />

      <FormSelect
        label="City"
        options={cities}
        placeholder={loadingCities ? "Loading cities..." : "Select city"}
        disabled={!stateId || loadingCities}
        error={errors.city?.message}
        {...register("city")}
      />

      <FormInput
        label="Pincode"
        placeholder="Enter pincode"
        inputMode="numeric"
        maxLength={10}
        error={errors.pincode?.message}
        {...register("pincode")}
      />
    </SectionCard>
  );
}

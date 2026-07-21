import { forwardRef, type SelectHTMLAttributes } from "react";
import type { LookupOption } from "../../types/registration.types";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  options: LookupOption[];
  placeholder?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, required, options, placeholder = "Select...", id, className = "", ...rest }, ref) => {
    const selectId = id || rest.name;
    return (
      <div>
        <label htmlFor={selectId} className="text-sm font-semibold text-brand-ink">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <select
          id={selectId}
          ref={ref}
          aria-invalid={Boolean(error)}
          className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200 focus:border-brand-orange focus:ring-brand-orange/20"
          } ${className}`}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={String(opt.id)}>
              {opt.name}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;

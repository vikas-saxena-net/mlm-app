import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  hint?: ReactNode;
  statusSlot?: ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, hint, statusSlot, id, className = "", ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div>
        <label htmlFor={inputId} className="text-sm font-semibold text-brand-ink">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative mt-2">
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-brand-orange focus:ring-brand-orange/20"
            } ${statusSlot ? "pr-10" : ""} ${className}`}
            {...rest}
          />
          {statusSlot && (
            <div className="absolute inset-y-0 right-3 flex items-center">{statusSlot}</div>
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
        ) : (
          hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;

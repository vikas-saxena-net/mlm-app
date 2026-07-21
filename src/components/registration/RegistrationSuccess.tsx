import { Link } from "react-router-dom";
import Icon from "../Icon";

interface RegistrationSuccessProps {
  username: string;
  onRegisterAnother: () => void;
}

export default function RegistrationSuccess({ username, onRegisterAnother }: RegistrationSuccessProps) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green text-white">
        <Icon name="check" className="w-8 h-8" />
      </div>
      <h2 className="mt-5 text-2xl font-extrabold text-brand-ink">Registration Successful!</h2>
      <p className="mt-2 text-sm text-slate-500">
        Welcome to HIO Health, <span className="font-semibold text-brand-ink">{username}</span>. Your
        account has been created successfully.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-orange-dark"
        >
          Go to Login
          <Icon name="arrowRight" className="w-4 h-4" />
        </Link>
        <button
          type="button"
          onClick={onRegisterAnother}
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 px-6 py-3 text-sm font-bold text-brand-ink transition hover:border-brand-orange hover:text-brand-orange"
        >
          Register Another Member
        </button>
      </div>
    </div>
  );
}

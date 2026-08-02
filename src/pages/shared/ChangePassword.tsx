import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { changePassword } from "../../services/authService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";

export default function ChangePassword() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

  const validate = (): boolean => {
    const next: { newPassword?: string; confirmPassword?: string } = {};
    if (newPassword.length < 6) next.newPassword = "New password must be at least 6 characters";
    if (newPassword !== confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.user_name) {
      toast.error("Could not determine your username. Please re-login and try again.");
      return;
    }
    if (!validate()) return;

    setSaving(true);
    try {
      await changePassword({
        user_name: user.user_name,
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Failed to change password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-slate-200 focus:border-brand-orange focus:ring-brand-orange/20"
    }`;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm max-w-lg">
      <h2 className="text-xl font-bold text-brand-ink">Change Password</h2>
      <p className="mt-1 text-sm text-slate-500">Update the password for your account.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="text-sm font-semibold text-brand-ink">Current Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            className={inputClass()}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">New Password</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            className={inputClass(Boolean(errors.newPassword))}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {errors.newPassword && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.newPassword}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">Confirm New Password</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            className={inputClass(Boolean(errors.confirmPassword))}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs font-medium text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? (
            <>
              <Spinner className="w-4 h-4" />
              Updating...
            </>
          ) : (
            <>
              Update Password
              <Icon name="arrowRight" className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

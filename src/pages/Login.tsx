import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Icon from "../components/Icon";
import Spinner from "../components/common/Spinner";
import logo from "../assets/img/logo.jpeg";
import { useAuth } from "../contexts/AuthContext";
import { roleNameFromGuid } from "../types/auth.types";
import type { ApiErrorShape } from "../services/api/httpClient";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await login(userName, password);
      toast.success(`Welcome back, ${user.user_name ?? "there"}!`);

      const from = (location.state as { from?: Location })?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        const role = roleNameFromGuid(user.role_guid);
        navigate(role === "admin" ? "/admin" : "/dashboard", { replace: true });
      }
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Invalid username or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-gradient-to-br from-orange-50 to-green-50 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="HIO Health" className="h-20 w-auto object-contain" />
          <h1 className="mt-4 text-2xl font-extrabold text-brand-ink">Member Login</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to access your HIO Health dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-brand-ink" htmlFor="userName">
              Username
            </label>
            <input
              id="userName"
              name="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              autoComplete="username"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-ink" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-7 py-3 font-bold text-white shadow-md transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Spinner className="w-4 h-4" />
                Signing in...
              </>
            ) : (
              <>
                Login
                <Icon name="arrowRight" className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to HIO Health?{" "}
          <Link to="/join" className="font-bold text-brand-green hover:underline">
            Join Free
          </Link>
        </p>
      </div>
    </section>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import logo from "../assets/img/logo.jpeg";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-gradient-to-br from-orange-50 to-green-50 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="HIO Health" className="h-16 w-auto object-contain" />
          <h1 className="mt-4 text-2xl font-extrabold text-brand-ink">Member Login</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to access your HIO Health dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-brand-ink" htmlFor="email">
              Email or Member ID
            </label>
            <input
              id="email"
              name="email"
              type="text"
              value={form.email}
              onChange={handleChange}
              required
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
              value={form.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-500">
              <input type="checkbox" className="rounded border-slate-300" />
              Remember me
            </label>
            <a href="#" className="font-semibold text-brand-orange hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-7 py-3 font-bold text-white shadow-md transition hover:bg-brand-orange-dark"
          >
            Login
            <Icon name="arrowRight" className="w-4 h-4" />
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

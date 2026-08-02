import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Icon from "../Icon";
import type { RoleName } from "../../types/auth.types";

interface ProtectedRouteProps {
  allowedRoles?: RoleName[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role is unrecognized (e.g. backend didn't return role_guid this time) — don't guess a
  // redirect target, since a wrong guess here can loop back into this same guard. Show an
  // inline recovery state instead.
  if (!role) {
    return (
      <div className="max-w-md mx-auto my-16 rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
          <Icon name="close" className="w-6 h-6" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-brand-ink">Couldn't determine your account role</h2>
        <p className="mt-2 text-sm text-slate-500">
          Something went wrong reading your account permissions. Please try logging in again.
        </p>
        <button
          type="button"
          onClick={logout}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-orange px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-orange-dark"
        >
          Back to Login
        </button>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const fallback = role === "admin" ? "/admin" : "/dashboard";
    if (location.pathname.startsWith(fallback)) {
      // Already at the "correct" fallback and still blocked — avoid looping.
      return (
        <div className="max-w-md mx-auto my-16 rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-brand-ink">You don't have access to this page</h2>
        </div>
      );
    }
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}

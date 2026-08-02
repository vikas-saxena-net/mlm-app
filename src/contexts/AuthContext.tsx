import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { login as loginRequest, fetchCurrentUser } from "../services/authService";
import {
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
  clearStoredAuth,
  AUTH_UNAUTHORIZED_EVENT,
} from "../utils/tokenStorage";
import { roleNameFromGuid, type AuthenticatedUserResponse, type RoleName } from "../types/auth.types";
import type { ApiErrorShape } from "../services/api/httpClient";

interface AuthContextValue {
  user: AuthenticatedUserResponse | null;
  role: RoleName | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userName: string, password: string) => Promise<AuthenticatedUserResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUserResponse | null>(() =>
    getStoredUser<AuthenticatedUserResponse>()
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const login = useCallback(async (userName: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginRequest({ user_name: userName, user_password: password });
      if (!response.success || !response.token || !response.user) {
        const error: ApiErrorShape = { status: 401, message: response.message || "Invalid username or password." };
        throw error;
      }
      setStoredToken(response.token);

      let resolvedUser = response.user;
      if (!resolvedUser.role_guid) {
        // The backend has occasionally returned a login response with no role info for a
        // valid user. Retry once via /auth/me (now that the token is stored) before giving up.
        try {
          const me = await fetchCurrentUser();
          if (me.role_guid) resolvedUser = me;
        } catch {
          // Ignore — fall through with whatever /auth/login gave us.
        }
      }

      setStoredUser(resolvedUser);
      setUser(resolvedUser);
      return resolvedUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: roleNameFromGuid(user?.role_guid),
      isAuthenticated: Boolean(user && getStoredToken()),
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

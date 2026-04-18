"use client";

import { create } from "zustand";
import { getCookie, setCookie, deleteCookie } from "@/lib/api/useFetch";
import { setRefreshCallback } from "@/lib/api/useFetch";
import type { AuthSession } from "@/lib/api/useFetch";
import { login as apiLogin, logout as apiLogout, getProfile } from "@/lib/api/authApi";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: AuthSession["user"] | null;
  status: AuthStatus;
  hydrated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  setHydrated: (value: boolean) => void;
  applySession: (session: AuthSession) => void;
}

// Internal refresh function - uses zustand's setState via get()
async function doRefreshSession(
  storeGet: () => AuthState,
  storeSet: (partial: Partial<AuthState>) => void
): Promise<boolean> {
  const REFRESH_KEY = "__auth_refresh_promise__";
  const existingPromise = (globalThis as any)[REFRESH_KEY] as Promise<boolean> | undefined;
  if (existingPromise) {
    return existingPromise;
  }
  console.warn(storeGet().status, "doRefreshSession");
  const refreshToken = getCookie("refreshToken");
  if (!refreshToken) {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    storeSet({ user: null, status: "unauthenticated" });
    return false;
  }

  const promise = (async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/auth/sessions/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken })
        }
      );

      if (!response.ok) {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        storeSet({ user: null, status: "unauthenticated" });
        return false;
      }

      const session: AuthSession = await response.json();
      setCookie("accessToken", session.accessToken);
      setCookie("refreshToken", session.refreshToken);
      storeSet({ user: session.user, status: "authenticated" });
      return true;
    } catch {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      storeSet({ user: null, status: "unauthenticated" });
      return false;
    } finally {
      delete (globalThis as any)[REFRESH_KEY];
    }
  })();

  (globalThis as any)[REFRESH_KEY] = promise;
  return promise;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: "idle",
  hydrated: false,

  setHydrated(value) {
    set({ hydrated: value });
  },

  applySession(session: AuthSession) {
    setCookie("accessToken", session.accessToken);
    setCookie("refreshToken", session.refreshToken);
    set({
      user: session.user,
      status: "authenticated"
    });
  },

  async login(username, password) {
    set({ status: "loading" });
    try {
      const session = await apiLogin(username, password);
      get().applySession(session);
    } catch (error) {
      set({ status: "unauthenticated" });
      throw error;
    }
  },

  async logout() {
    try {
      await apiLogout();
    } finally {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      set({
        user: null,
        status: "unauthenticated"
      });
    }
  },

  async refreshSession() {
    return doRefreshSession(get, set);
  },

  async checkAuth() {
    try {
      const user = await getProfile();
      set({ user, status: "authenticated" });
      return true;
    } catch {
      // getProfile() failure will have triggered refresh via useFetch's callback
      // Retry getProfile once more with the new token
      const newToken = getCookie("accessToken");
      if (newToken) {
        try {
          const user = await getProfile();
          set({ user, status: "authenticated" });
          return true;
        } catch {
          set({ status: "unauthenticated" });
          return false;
        }
      }
      set({ status: "unauthenticated" });
      return false;
    }
  }
}));

// Register the refresh callback after store is created
if (typeof window !== "undefined") {
  setRefreshCallback(() => useAuthStore.getState().refreshSession());
}

// Initialize auth state from cookies on hydration
if (typeof window !== "undefined") {
  const accessToken = getCookie("accessToken");
  if (accessToken) {
    useAuthStore.setState({ status: "authenticated" });
  }
  useAuthStore.setState({ hydrated: true });
}

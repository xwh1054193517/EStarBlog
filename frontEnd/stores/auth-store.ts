"use client";

import { create } from "zustand";
import { getCookie, setCookie, deleteCookie } from "@/lib/api/useFetch";
import type { AuthSession } from "@/lib/api/useFetch";
import { login as apiLogin, logout as apiLogout, getProfile } from "@/lib/api/authApi";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: AuthSession["user"] | null;
  status: AuthStatus;
  hydrated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
  checkAuth: () => Promise<boolean>;
  setHydrated: (value: boolean) => void;
  applySession: (session: AuthSession) => void;
}

let refreshPromise: Promise<string | null> | null = null;

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: "idle",
  hydrated: false,

  setHydrated(value) {
    set({ hydrated: value });
  },

  applySession(session: AuthSession) {
    setCookie("accessToken", session.accessToken, session.expiresIn);
    setCookie("refreshToken", session.refreshToken, 60 * 60 * 24 * 7);
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
    if (refreshPromise) {
      return refreshPromise;
    }

    const refreshToken = getCookie("refreshToken");
    if (!refreshToken) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      set({ user: null, status: "unauthenticated" });
      return null;
    }

    refreshPromise = (async () => {
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
          set({ user: null, status: "unauthenticated" });
          return null;
        }

        const session: AuthSession = await response.json();
        setCookie("accessToken", session.accessToken, session.expiresIn);
        setCookie("refreshToken", session.refreshToken, 60 * 60 * 24 * 7);
        set({ user: session.user, status: "authenticated" });
        return session.accessToken;
      } catch {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        set({ user: null, status: "unauthenticated" });
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },

  async checkAuth() {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      set({ status: "unauthenticated" });
      return false;
    }

    try {
      const user = await getProfile();
      set({ user, status: "authenticated" });
      return true;
    } catch {
      const newToken = await get().refreshSession();
      return !!newToken;
    }
  }
}));

// Initialize auth state from cookies on hydration
if (typeof window !== "undefined") {
  const accessToken = getCookie("accessToken");
  if (accessToken) {
    useAuthStore.setState({ status: "authenticated" });
  }
  useAuthStore.setState({ hydrated: true });
}

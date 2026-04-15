"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  adminApiLogin,
  adminApiLogout,
  adminApiProfile,
  adminApiRefresh,
  registerAdminApiHooks
} from "@/lib/admin-api";
import type { AdminAuthSession, AdminUser } from "@/lib/admin-types";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AdminUser | null;
  status: AuthStatus;
  hydrated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: (shouldNotifyServer?: boolean) => Promise<void>;
  refreshSession: () => Promise<string | null>;
  fetchProfile: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setHydrated: (value: boolean) => void;
  applySession: (session: AdminAuthSession) => void;
}

let refreshPromise: Promise<string | null> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      status: "idle",
      hydrated: false,
      async login(username, password) {
        set({ status: "loading" });
        try {
          const session = await adminApiLogin(username, password);
          get().applySession(session);
          set({ status: "authenticated" });
        } catch (error) {
          set({ status: "unauthenticated" });
          throw error;
        }
      },
      async logout(shouldNotifyServer = true) {
        const accessToken = get().accessToken;

        if (shouldNotifyServer && accessToken) {
          try {
            await adminApiLogout(accessToken);
          } catch {
            // Ignore logout API failures during local sign-out.
          }
        }

        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          status: "unauthenticated"
        });
      },
      async refreshSession() {
        if (refreshPromise) {
          return refreshPromise;
        }

        const refreshToken = get().refreshToken;
        if (!refreshToken) {
          await get().logout(false);
          return null;
        }

        refreshPromise = adminApiRefresh(refreshToken)
          .then((session) => {
            get().applySession(session);
            set({ status: "authenticated" });
            return session.accessToken;
          })
          .catch(async () => {
            await get().logout(false);
            return null;
          })
          .finally(() => {
            refreshPromise = null;
          });

        return refreshPromise;
      },
      async fetchProfile() {
        const accessToken = get().accessToken;
        if (!accessToken) {
          throw new Error("Missing access token");
        }

        const user = await adminApiProfile(accessToken);
        set({
          user,
          status: "authenticated"
        });
      },
      async restoreSession() {
        const { accessToken, refreshToken, user } = get();

        if (!accessToken && !refreshToken) {
          set({ status: "unauthenticated" });
          return;
        }

        if (accessToken && user) {
          set({ status: "authenticated" });
          return;
        }

        const nextAccessToken = await get().refreshSession();

        if (!nextAccessToken) {
          set({ status: "unauthenticated" });
        }
      },
      setHydrated(value) {
        set({ hydrated: value });
      },
      applySession(session) {
        set({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          user: session.user,
          status: "authenticated"
        });
      }
    }),
    {
      name: "vx-blog-admin-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);

registerAdminApiHooks({
  onRefresh: () => useAuthStore.getState().refreshSession(),
  onLogout: () => {
    void useAuthStore.getState().logout(false);
  }
});

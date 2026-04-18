import { api, AuthSession, deleteCookie, getCookie, setCookie } from "./useFetch";

// Auth API functions - skip redirect on 401 since login page doesn't need auth
export async function login(username: string, password: string): Promise<AuthSession> {
  const session = await api.post<AuthSession>(
    "/auth/sessions",
    { username, password },
    { skipAuth: true, skipRedirectOn401: true }
  );
  setCookie("accessToken", session.accessToken);
  setCookie("refreshToken", session.refreshToken);
  return session;
}

export async function logout(): Promise<void> {
  const token = getCookie("accessToken");
  try {
    if (token) {
      await api.delete("/auth/sessions/current", { headers: { Authorization: `Bearer ${token}` } });
    }
  } finally {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
  }
}

export async function getProfile(): Promise<AuthSession["user"]> {
  return api.get<AuthSession["user"]>("/auth/me");
}

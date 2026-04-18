const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface ApiErrorResponse {
  timestamp: string;
  path: string;
  statusCode: number;
  error: string;
  message: string | string[];
  requestId: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export class ApiException extends Error {
  constructor(
    public override message: string,
    public statusCode: number,
    public error: string,
    public requestId?: string
  ) {
    super(message);
    this.name = "ApiException";
  }
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );
  return cookies[name] || null;
}

function setCookie(name: string, value: string, expiresInSeconds: number) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + expiresInSeconds * 1000);
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Strict`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getCookie("refreshToken");
  if (!refreshToken) return false;

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sessions/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        return false;
      }

      const session: AuthSession = await response.json();
      setCookie("accessToken", session.accessToken, session.expiresIn);
      setCookie("refreshToken", session.refreshToken, 60 * 60 * 24 * 7);
      return true;
    } catch {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function getAuthToken(): string | null {
  return getCookie("accessToken");
}

function handleResponse<T>(response: Response, skipRedirect = false): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!response.ok) {
      if (response.status === 401 && !skipRedirect && typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }

      response
        .json()
        .then((errorData: ApiErrorResponse) => {
          const message = errorData.message
            ? Array.isArray(errorData.message)
              ? errorData.message.join(", ")
              : errorData.message
            : `HTTP ${response.status}`;
          reject(
            new ApiException(
              message,
              response.status,
              errorData.error || "Error",
              errorData.requestId
            )
          );
        })
        .catch(() => {
          reject(new ApiException(`HTTP ${response.status}`, response.status, "Error"));
        });
      return;
    }

    if (response.status === 204) {
      resolve(undefined as T);
      return;
    }

    response
      .json()
      .then((data: T) => {
        resolve(data);
      })
      .catch(() => {
        resolve(undefined as T);
      });
  });
}

export interface RequestConfig extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
  skipRedirectOn401?: boolean;
}

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  const url = `${API_BASE_URL}${endpoint}`;
  if (!params) return url;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { params, headers, skipAuth, skipRedirectOn401, ...rest } = config;

  const doRequest = async (token: string | null, isRetry: boolean): Promise<T> => {
    const requestHeaders: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    };

    if (
      !headers?.["Content-Type"] &&
      !headers?.["content-type"] &&
      !(rest.body instanceof FormData)
    ) {
      requestHeaders["Content-Type"] = "application/json";
    }

    const response = await fetch(buildUrl(endpoint, params), {
      ...rest,
      headers: requestHeaders
    });

    if (response.status === 401 && !isRetry && !skipAuth) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return doRequest(getAuthToken(), true);
      }
    }

    return handleResponse<T>(response, skipRedirectOn401 || isRetry);
  };

  return doRequest(!skipAuth ? getAuthToken() : null, false);
}

export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "POST", body: JSON.stringify(data) }),

  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "PUT", body: JSON.stringify(data) }),

  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "PATCH", body: JSON.stringify(data) }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "DELETE" })
};

export { getCookie, setCookie, deleteCookie, getAuthToken };

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

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; SameSite=Strict`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

type RefreshCallback = () => Promise<boolean>;
let refreshCallback: RefreshCallback | null = null;

export function setRefreshCallback(cb: RefreshCallback) {
  refreshCallback = cb;
}

let pendingRefreshPromise: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  if (pendingRefreshPromise) {
    return pendingRefreshPromise;
  }

  if (refreshCallback) {
    pendingRefreshPromise = refreshCallback().finally(() => {
      pendingRefreshPromise = null;
    });
    return pendingRefreshPromise;
  }

  // Fallback: no callback registered, return false
  return false;
}

async function waitForRefreshIfNeeded(skipAuth?: boolean): Promise<boolean> {
  if (skipAuth || !pendingRefreshPromise) {
    return true;
  }

  return pendingRefreshPromise;
}

type RefreshRetryResult<T> =
  | { refreshed: true; data: T }
  | { refreshed: false };

async function refreshAndRetry<T>(retryRequest: () => Promise<T>): Promise<RefreshRetryResult<T>> {
  const refreshed = await doRefresh();
  if (!refreshed) {
    return { refreshed: false };
  }

  return { refreshed: true, data: await retryRequest() };
}

function getAuthToken(): string | null {
  return getCookie("accessToken");
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

async function handleResponse<T>(response: Response, skipRedirect = false): Promise<T> {
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

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { params, headers, skipAuth, skipRedirectOn401, ...rest } = config;

  const doRequest = async (isRetry: boolean): Promise<T> => {
    if (!skipAuth && !isRetry) {
      const canContinue = await waitForRefreshIfNeeded(skipAuth);
      if (!canContinue) {
        return handleResponse<T>(new Response(null, { status: 401 }), skipRedirectOn401);
      }
    }

    const token = !skipAuth ? getAuthToken() : null;
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
      const retryResult = await refreshAndRetry(() => doRequest(true));
      if (retryResult.refreshed) {
        return retryResult.data;
      }
    }

    return handleResponse<T>(response, skipRedirectOn401 || isRetry);
  };

  return doRequest(false);
}

export const api = {
  request: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, config),

  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "POST", body: JSON.stringify(data) }),

  postForm: <T>(endpoint: string, data: FormData, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "POST", body: data }),

  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "PUT", body: JSON.stringify(data) }),

  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "PATCH", body: JSON.stringify(data) }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "DELETE" })
};

export { getCookie, setCookie, deleteCookie, getAuthToken };

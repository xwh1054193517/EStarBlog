import { api } from "./api/useFetch";

const VISITOR_ID_KEY = "es_blog_visitor_id";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";

  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

export async function trackPageView(path?: string) {
  const visitorId = getVisitorId();
  if (!visitorId) return;

  try {
    await api.post(
      "/stats/track",
      {
        visitorId,
        path: path || (typeof window !== "undefined" ? window.location.pathname : undefined)
      },
      {
        skipAuth: true,
        skipRedirectOn401: true
      }
    );
  } catch (error) {
    console.warn("Failed to track page view:", error);
  }
}

let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

export function startHeartbeat() {
  if (typeof window === "undefined") return;
  if (heartbeatInterval) return;

  const sendHeartbeat = async () => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    try {
      await api.post(
        "/stats/track",
        {
          visitorId,
          path: window.location.pathname
        },
        {
          skipAuth: true,
          skipRedirectOn401: true
        }
      );
    } catch (error) {
      console.warn("Failed to send heartbeat:", error);
    }
  };

  sendHeartbeat();
  heartbeatInterval = setInterval(sendHeartbeat, 30000);
}

export function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

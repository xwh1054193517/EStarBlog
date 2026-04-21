"use client";

import Script from "next/script";

export default function TrackerScript() {
  return (
    <Script id="tracker-init" strategy="afterInteractive">
      {`
        (function() {
          var VISITOR_ID_KEY = 'es_blog_visitor_id';
          function getVisitorId() {
            var vid = localStorage.getItem(VISITOR_ID_KEY);
            if (!vid) {
              vid = 'v_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
              localStorage.setItem(VISITOR_ID_KEY, vid);
            }
            return vid;
          }
          function track(path) {
            var vid = getVisitorId();
            if (!vid) return;
            fetch('/api/stats/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ visitorId: vid, path: path || window.location.pathname })
            }).catch(function() {});
          }
          track();
          setInterval(function() { track(); }, 30000);
          if (typeof window !== 'undefined') {
            window.addEventListener('hashchange', function() { track(window.location.pathname); });
          }
        })();
      `}
    </Script>
  );
}

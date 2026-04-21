"use client";

import Script from "next/script";

export default function ThemeScript() {
  return (
    <Script id="theme-init" strategy="beforeInteractive">
      {`
        (function () {
          try {
            var stored = localStorage.getItem('theme');
            var dark = stored ? stored === 'dark' : true;
            document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
          } catch (error) {
            document.documentElement.setAttribute('data-theme', 'light');
          }
        })();
      `}
    </Script>
  );
}

"use client";

/**
 * Last-resort UI when the App Router root crashes.
 * Hard links use the Pages basePath so Home never soft-routes.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const base = "/b-c-merchstore.io-";
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f4f4f2",
          color: "#0c0c0c",
        }}
      >
        <div style={{ textAlign: "center", padding: 24, maxWidth: 420 }}>
          <h1 style={{ fontSize: 28, margin: "0 0 12px" }}>Something went wrong</h1>
          <p style={{ margin: "0 0 24px", color: "#0c0c0c99" }}>
            The page hit an unexpected error. Your demo order may still be saved
            in this browser.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                border: 0,
                borderRadius: 8,
                padding: "10px 16px",
                background: "#0c0c0c",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href={`${base}/`}
              style={{
                borderRadius: 8,
                padding: "10px 16px",
                border: "1px solid #0c0c0c33",
                color: "#0c0c0c",
                textDecoration: "none",
              }}
            >
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

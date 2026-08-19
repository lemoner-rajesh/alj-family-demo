// Vercel Edge Middleware — the equivalent of basicAuthMiddleware.js for a
// static deploy. basicAuthMiddleware.js only runs inside Vite's own dev/
// preview Node server (`configureServer`/`configurePreviewServer`); once
// `vercel build` outputs static files to dist/, that server no longer
// exists, so nothing enforces auth on Vercel without this. This file is
// picked up automatically by Vercel (root-level `middleware.js`) and runs
// at the edge in front of every request — static assets included — before
// any file is served, independent of which framework preset the project
// uses.
//
// Reads the same BASIC_AUTH_USER / BASIC_AUTH_PASS names basicAuthMiddleware.js
// does, but from Vercel's own Project Settings → Environment Variables, not
// the local .env file (that never reaches the deployed edge runtime). Same
// fallback as local dev too: unset either one and auth is skipped entirely,
// rather than failing closed and locking everyone out.

function checkAuth(request, username, password) {
  const header = request.headers.get("authorization");
  if (!header) return false;
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return false;
  const decoded = atob(encoded);
  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) return false;
  const user = decoded.slice(0, separatorIndex);
  const pass = decoded.slice(separatorIndex + 1);
  return user === username && pass === password;
}

export default function middleware(request) {
  const username = process.env.BASIC_AUTH_USER;
  const password = process.env.BASIC_AUTH_PASS;
  if (!username || !password) return;

  if (checkAuth(request, username, password)) return;

  return new Response("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Jameel Family Prototype"' },
  });
}

export const config = {
  matcher: "/:path*",
};

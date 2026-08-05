// Real HTTP Basic Auth for the Vite dev/preview server — checked server-side,
// so credentials never ship in the client bundle. Triggers the browser's
// native login prompt. Only runs if BASIC_AUTH_USER / BASIC_AUTH_PASS are
// set (see .env.example); otherwise the plugin is skipped entirely.
//
// Note: this only protects `npm run dev` / `npm run preview` — a static
// deploy (Netlify, GitHub Pages, etc.) serves files directly and won't run
// this file. That would need the host's own middleware/edge-function
// equivalent (e.g. Vercel's `middleware.js`, Netlify's `_headers`/Edge
// Functions).

function checkAuth(req, username, password) {
  const header = req.headers["authorization"];
  if (!header) return false;
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return false;
  const decoded = Buffer.from(encoded, "base64").toString("utf-8");
  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) return false;
  const user = decoded.slice(0, separatorIndex);
  const pass = decoded.slice(separatorIndex + 1);
  return user === username && pass === password;
}

export function basicAuthPlugin(env) {
  const username = env.BASIC_AUTH_USER;
  const password = env.BASIC_AUTH_PASS;
  if (!username || !password) return null;

  const middleware = (req, res, next) => {
    if (checkAuth(req, username, password)) {
      next();
      return;
    }
    res.statusCode = 401;
    res.setHeader("WWW-Authenticate", 'Basic realm="Jameel Family Prototype"');
    res.end("Authentication required.");
  };

  return {
    name: "basic-auth",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

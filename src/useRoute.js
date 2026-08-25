import { useEffect, useState } from "react";

// Minimal path-based router — just enough to dispatch between App.jsx's
// pages by URL. `vercel.json`'s catch-all rewrite to index.html already
// makes any path work on a hard refresh, so this only needs to read
// `location.pathname` and react to back/forward navigation.
export function useRoute() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return path;
}

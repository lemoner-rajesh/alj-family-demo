import { useCallback, useLayoutEffect, useRef, useState } from "react";

// Measures the DOM position of registered nodes and turns a list of
// {parentId, childId} edges into SVG path data, relative to a canvas
// element. `buildPath(x1, y1, x2, y2)` controls the line shape (curved,
// elbow, ...) so different tree renderers can share the measuring logic.
export function useMeasuredEdges(edges, buildPath) {
  const canvasRef = useRef(null);
  const nodeRefs = useRef(new Map());
  const [edgePaths, setEdgePaths] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const registerNode = useCallback((id, el) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }, []);

  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    const paths = [];

    edges.forEach((edge) => {
      // A person registers two nodes: their plain id (their own card only —
      // where lines from THEIR parent arrive) and `${id}:source` (their
      // whole marriage pair — where the branch to THEIR OWN children
      // departs from). Using the same node for both would mean an incoming
      // line lands on this person's marriage with their own spouse instead
      // of their own card.
      const pEl = nodeRefs.current.get(`${edge.parentId}:source`);
      const cEl = nodeRefs.current.get(edge.childId);
      if (!pEl || !cEl) return;

      const pRect = pEl.getBoundingClientRect();
      const cRect = cEl.getBoundingClientRect();
      const x1 = pRect.left + pRect.width / 2 - canvasRect.left;
      const y1 = pRect.bottom - canvasRect.top;
      const x2 = cRect.left + cRect.width / 2 - canvasRect.left;
      const y2 = cRect.top - canvasRect.top;

      paths.push({ id: `${edge.parentId}-${edge.childId}`, d: buildPath(x1, y1, x2, y2), edge });
    });

    setEdgePaths(paths);
    // Deliberately NOT canvas.scrollWidth/scrollHeight: those include the
    // absolutely-positioned SVG overlay's own (previous-render) size, which
    // creates a feedback loop where the canvas can never shrink back down
    // after collapsing a large branch. getBoundingClientRect reflects only
    // the canvas's real CSS box, driven by its normal-flow content.
    setCanvasSize({ width: canvasRect.width, height: canvasRect.height });
  }, [edges, buildPath]);

  useLayoutEffect(() => {
    measure();
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(canvas);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return { canvasRef, registerNode, edgePaths, canvasSize };
}

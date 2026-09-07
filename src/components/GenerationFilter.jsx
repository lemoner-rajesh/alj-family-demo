import { useEffect, useRef, useState } from "react";
import { genColorIndex } from "../utils/familyUtils";

export default function GenerationFilter({ generationGroups, collapsed, forceOpenIds, onToggleGeneration }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (generationGroups.length === 0) return null;

  // Collapsing a generation hides every deeper generation nested under it,
  // so once we hit a collapsed one, every later row has nothing visible
  // left to toggle — disable it until the ancestor is expanded again.
  let blockedByAncestor = false;

  return (
    <div className="gen-filter" ref={rootRef}>
      <button
        type="button"
        className="gen-filter__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        Filter
        <svg className="gen-filter__chevron" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 9l6 6 6-6"
          />
        </svg>
      </button>

      {open && (
        <div className="gen-filter__panel" role="listbox" aria-label="Filter by generation">
          {generationGroups.map(({ gen, ids, label }) => {
            const anyExpanded = ids.some((id) => forceOpenIds.has(id) || !collapsed.has(id));
            const disabled = blockedByAncestor;
            if (!anyExpanded) blockedByAncestor = true;
            return (
              <button
                key={gen}
                type="button"
                role="option"
                aria-selected={anyExpanded}
                className="gen-filter__row"
                disabled={disabled}
                onClick={() => onToggleGeneration(ids, anyExpanded)}
                title={
                  disabled
                    ? `${label} is hidden until an earlier generation is expanded`
                    : anyExpanded
                      ? `Collapse all of ${label}`
                      : `Expand all of ${label}`
                }
              >
                <span className="gen-filter__label">{label}</span>
                <span
                  className={`gen-filter__dot gen-${genColorIndex(gen)} ${anyExpanded ? "" : "gen-filter__dot--off"}`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

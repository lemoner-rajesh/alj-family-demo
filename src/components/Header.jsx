import SearchBar from "./SearchBar";
import Legend from "./Legend";

export default function Header({
  view,
  onViewChange,
  query,
  onQueryChange,
  stats,
  onExpandAll,
  onCollapseAll,
  onOpenOption1,
  onOpenOption2,
  onOpenOption3,
  onOpenOption4,
  onOpenOption5,
}) {
  return (
    <header className="app-header">
      <div className="app-header__top">
        <div className="app-header__title">
          <h1>The Jameel Family</h1>
          <p>Interactive family tree prototype — parents, marriages, and four generations of descendants.</p>
          <div className="option-links">
            {onOpenOption1 && (
              <button type="button" className="option-link" onClick={onOpenOption1}>
                View Option 1 — bare tree canvas →
              </button>
            )}
            {onOpenOption2 && (
              <button type="button" className="option-link" onClick={onOpenOption2}>
                View Option 2 — PDF-style reference →
              </button>
            )}
            {onOpenOption3 && (
              <button type="button" className="option-link" onClick={onOpenOption3}>
                View Option 3 — dark org chart →
              </button>
            )}
            {onOpenOption4 && (
              <button type="button" className="option-link" onClick={onOpenOption4}>
                View Option 4 — free-form tree →
              </button>
            )}
            {onOpenOption5 && (
              <button type="button" className="option-link" onClick={onOpenOption5}>
                View Option 5 — grouped org chart →
              </button>
            )}
          </div>
        </div>

        <div className="app-header__stats">
          <div className="stat">
            <span className="stat__value">{stats.total}</span>
            <span className="stat__label">People</span>
          </div>
          <div className="stat">
            <span className="stat__value">{stats.generations}</span>
            <span className="stat__label">Generations</span>
          </div>
          <div className="stat">
            <span className="stat__value">{stats.bios}</span>
            <span className="stat__label">Bios on file</span>
          </div>
          <div className="stat">
            <span className="stat__value">{stats.unverified}</span>
            <span className="stat__label">Need research</span>
          </div>
        </div>
      </div>

      <div className="app-header__controls">
        <div className="view-toggle" role="tablist" aria-label="Tree view mode">
          <button
            type="button"
            role="tab"
            aria-selected={view === "tree"}
            className={view === "tree" ? "is-active" : ""}
            onClick={() => onViewChange("tree")}
          >
            Tree view
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "timeline"}
            className={view === "timeline" ? "is-active" : ""}
            onClick={() => onViewChange("timeline")}
          >
            Timeline view
          </button>
        </div>

        <SearchBar value={query} onChange={onQueryChange} />

        {view === "tree" && (
          <div className="expand-controls">
            <button type="button" onClick={onExpandAll}>
              Expand all
            </button>
            <button type="button" onClick={onCollapseAll}>
              Collapse all
            </button>
          </div>
        )}

        <span className="app-header__hint">
          {view === "tree"
            ? "Click a card for details · click ⊕ to open a branch"
            : "Click a card for details"}
        </span>
      </div>

      <Legend />
    </header>
  );
}

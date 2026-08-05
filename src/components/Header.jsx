import SearchBar from "./SearchBar";
import Legend from "./Legend";

export default function Header({ view, onViewChange, query, onQueryChange, stats, onExpandAll, onCollapseAll }) {
  const hint =
    view === "tree" ? "Click a card for details · click ⊕ to open a branch" : "Click a card for details";

  return (
    <header className="app-header">
      <div className="app-header__top">
        <div className="app-header__title">
          <h1>The Jameel Family</h1>
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
      </div>

      <Legend hint={hint} />
    </header>
  );
}

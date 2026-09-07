import SearchBar from "./SearchBar";
import Legend from "./Legend";
import GenerationFilter from "./GenerationFilter";

export default function Header({
  query,
  onQueryChange,
  stats,
  generationGroups,
  collapsed,
  forceOpenIds,
  onToggleGeneration,
}) {
  const hint = "Click a card for details · click ⊕ to open a branch";

  return (
    <header className="app-header">
      <div className="app-header__top">
        <div className="app-header__controls">
          <SearchBar value={query} onChange={onQueryChange} />

          <GenerationFilter
            generationGroups={generationGroups}
            collapsed={collapsed}
            forceOpenIds={forceOpenIds}
            onToggleGeneration={onToggleGeneration}
          />
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

      <Legend hint={hint} />
    </header>
  );
}

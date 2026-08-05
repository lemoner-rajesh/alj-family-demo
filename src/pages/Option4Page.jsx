import { useMemo, useState } from "react";
import FamilyChartTree from "../components/FamilyChartTree";
import DetailDrawer from "../components/DetailDrawer";
import { familyRoot, defaultCollapsedIds } from "../data/familyData";
import { buildIndex, searchOpenPath, getRelations, GENERATION_LABELS } from "../utils/familyUtils";

// A fourth treatment, same dark card style as Option 3, but a genuinely
// different layout: a recursive node-link tree where each branch grows
// directly under its own parent instead of sharing full-width generation
// rows. CSS flow — not a shared row — keeps subtrees from overlapping,
// and lineage is unambiguous since children only ever sit under their
// actual parent.
export default function Option4Page({ onBack }) {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(() => new Set(defaultCollapsedIds));
  const [manualOpenIds, setManualOpenIds] = useState(() => new Set());
  const [selectedId, setSelectedId] = useState(null);

  const index = useMemo(() => buildIndex(familyRoot), []);

  const forceOpenIds = useMemo(() => {
    const fromSearch = searchOpenPath(familyRoot, query);
    return new Set([...fromSearch, ...manualOpenIds]);
  }, [query, manualOpenIds]);

  const selectedPerson = selectedId ? index.get(selectedId)?.person : null;
  const selectedGeneration = selectedId ? index.get(selectedId)?.generation : null;
  const relations = selectedPerson ? getRelations(index, selectedPerson) : { spouse: null, children: [] };

  const handleToggle = (id) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelect = (person) => setSelectedId(person.id);

  const handleJump = (person) => {
    const entry = index.get(person.id);
    if (entry) setManualOpenIds((prev) => new Set([...prev, ...entry.path]));
    setSelectedId(person.id);
  };

  return (
    <div className="chart-page">
      <button type="button" className="bare-back chart-back" onClick={onBack}>
        ← Back
      </button>

      <div className="chart-search">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path
            fill="currentColor"
            d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"
          />
        </svg>
        <input
          type="text"
          value={query}
          placeholder="Search by name or business…"
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search family members"
        />
      </div>

      <FamilyChartTree
        root={familyRoot}
        collapsed={collapsed}
        onToggle={handleToggle}
        selectedId={selectedId}
        onSelect={handleSelect}
        query={query}
        forceOpenIds={forceOpenIds}
      />

      {selectedPerson && (
        <DetailDrawer
          person={selectedPerson}
          generationLabel={GENERATION_LABELS[selectedGeneration] || `Generation ${selectedGeneration}`}
          relations={relations}
          onClose={() => setSelectedId(null)}
          onJump={handleJump}
        />
      )}

      {selectedPerson && <div className="drawer-backdrop" onClick={() => setSelectedId(null)} />}
    </div>
  );
}

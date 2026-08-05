import { useMemo, useState } from "react";
import FamilyGroupTree from "../components/FamilyGroupTree";
import DetailDrawer from "../components/DetailDrawer";
import { familyRoot, defaultCollapsedIds } from "../data/familyData";
import { buildIndex, searchOpenPath, getRelations, GENERATION_LABELS } from "../utils/familyUtils";

// A fifth treatment, modeled on the BALKANGraph-style "grouped" org chart
// reference: light page, couples wrapped in a soft gray box only when they
// have children to collapse, blue name/date tags under circular avatars.
// Same overlap-free recursive layout engine as Option 4.
export default function Option5Page({ onBack }) {
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
    <div className="grp-page">
      <button type="button" className="bare-back grp-back" onClick={onBack}>
        ← Back
      </button>

      <div className="grp-search">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path
            fill="currentColor"
            d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"
          />
        </svg>
        <input
          type="text"
          value={query}
          placeholder="Search... type ? to get help."
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search family members"
        />
      </div>

      <FamilyGroupTree
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

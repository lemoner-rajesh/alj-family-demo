import { useMemo, useState } from "react";
import PdfTreeView from "../components/PdfTreeView";
import DetailDrawer from "../components/DetailDrawer";
import { familyRoot, defaultCollapsedIds } from "../data/familyData";
import { buildIndex, getRelations, GENERATION_LABELS } from "../utils/familyUtils";

const EMPTY_SET = new Set();

// Recreates the look of the source PDF chart — plain boxes, dashed
// generation dividers, "M" marriage marker, highlighter-style bio/flag
// callouts — using the same mock data and click-to-inspect interaction.
export default function Option2Page({ onBack }) {
  const [collapsed, setCollapsed] = useState(() => new Set(defaultCollapsedIds));
  const [selectedId, setSelectedId] = useState(null);

  const index = useMemo(() => buildIndex(familyRoot), []);

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
    if (entry) {
      setCollapsed((prev) => {
        const next = new Set(prev);
        entry.path.forEach((id) => next.delete(id));
        return next;
      });
    }
    setSelectedId(person.id);
  };

  return (
    <div className="pdf-page">
      <button type="button" className="bare-back" onClick={onBack}>
        ← Back
      </button>

      <div className="pdf-sheet">
        <h1 className="pdf-title">The Jameel Family</h1>
        <p className="pdf-subtitle">Draft family tree — reference layout</p>

        <PdfTreeView
          root={familyRoot}
          collapsed={collapsed}
          onToggle={handleToggle}
          selectedId={selectedId}
          onSelect={handleSelect}
          forceOpenIds={EMPTY_SET}
        />
      </div>

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

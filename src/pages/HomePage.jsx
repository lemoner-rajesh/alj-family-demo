import { useMemo, useState } from "react";
import Header from "../components/Header";
import TreeView from "../components/TreeView";
import TimelineView from "../components/TimelineView";
import DetailDrawer from "../components/DetailDrawer";
import { familyRoot, defaultCollapsedIds } from "../data/familyData";
import { buildIndex, flattenPeople, searchOpenPath, getRelations, GENERATION_LABELS } from "../utils/familyUtils";

export default function HomePage() {
  const [view, setView] = useState("tree");
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(() => new Set(defaultCollapsedIds));
  const [manualOpenIds, setManualOpenIds] = useState(() => new Set());
  const [selectedId, setSelectedId] = useState(null);

  const index = useMemo(() => buildIndex(familyRoot), []);
  const flat = useMemo(() => flattenPeople(familyRoot), []);

  const stats = useMemo(() => {
    const generations = new Set(flat.map((e) => e.generation));
    return {
      total: flat.length,
      generations: generations.size,
      bios: flat.filter((e) => e.person.hasBio).length,
      unverified: flat.filter((e) => e.person.unverified).length,
    };
  }, [flat]);

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

  const handleExpandAll = () => setCollapsed(new Set());

  const handleCollapseAll = () => {
    const withChildren = flat
      .filter((e) => !e.isSpouse && (e.person.children || []).length > 0)
      .map((e) => e.person.id);
    setCollapsed(new Set(withChildren));
  };

  const handleSelect = (person) => setSelectedId(person.id);

  const handleJump = (person) => {
    const entry = index.get(person.id);
    if (entry) setManualOpenIds((prev) => new Set([...prev, ...entry.path]));
    setSelectedId(person.id);
    setView("tree");
  };

  return (
    <div className="app">
      <Header
        view={view}
        onViewChange={setView}
        query={query}
        onQueryChange={setQuery}
        stats={stats}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
      />

      <main className="app-main">
        {view === "tree" ? (
          <TreeView
            root={familyRoot}
            collapsed={collapsed}
            onToggle={handleToggle}
            selectedId={selectedId}
            onSelect={handleSelect}
            query={query}
            forceOpenIds={forceOpenIds}
          />
        ) : (
          <TimelineView root={familyRoot} selectedId={selectedId} onSelect={handleSelect} query={query} />
        )}
      </main>

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

import { useMemo, useState } from "react";
import Header from "../components/Header";
import TreeView from "../components/TreeView";
import TimelineView from "../components/TimelineView";
import DetailDrawer from "../components/DetailDrawer";
import { familyRoot, defaultCollapsedIds } from "../data/familyData";
import {
  buildIndex,
  flattenPeople,
  searchOpenPath,
  getRelations,
  GENERATION_LABELS,
  MIN_COLLAPSIBLE_GEN,
} from "../utils/familyUtils";

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
    };
  }, [flat]);

  const forceOpenIds = useMemo(() => {
    const fromSearch = searchOpenPath(familyRoot, query);
    return new Set([...fromSearch, ...manualOpenIds]);
  }, [query, manualOpenIds]);

  const generationGroups = useMemo(() => {
    const byGen = new Map();
    flat.forEach((entry) => {
      if (entry.isSpouse || entry.generation < MIN_COLLAPSIBLE_GEN) return;
      if (!(entry.person.children || []).length) return;
      if (!byGen.has(entry.generation)) byGen.set(entry.generation, []);
      byGen.get(entry.generation).push(entry.person.id);
    });
    // Each group's ids are the people whose children make up the NEXT
    // generation, so a button collapses generation `gen + 1` into view —
    // e.g. collapsing Origins hides Generation 1, so the button is labeled
    // "Generation 1" rather than "Origins".
    return [...byGen.entries()]
      .sort(([a], [b]) => a - b)
      .map(([gen, ids]) => ({
        gen: gen + 1,
        ids,
        label: GENERATION_LABELS[gen + 1] || `Generation ${gen + 1}`,
      }));
  }, [flat]);

  const selectedPerson = selectedId ? index.get(selectedId)?.person : null;
  const selectedGeneration = selectedId ? index.get(selectedId)?.generation : null;
  const relations = selectedPerson ? getRelations(index, selectedPerson) : { spouses: [], children: [] };

  const handleToggle = (id) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleGeneration = (ids, anyExpanded) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => {
        if (anyExpanded) next.add(id);
        else next.delete(id);
      });
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
        generationGroups={generationGroups}
        collapsed={collapsed}
        forceOpenIds={forceOpenIds}
        onToggleGeneration={handleToggleGeneration}
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
          gen={selectedGeneration}
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

import ChartCoupleUnit from "./ChartCoupleUnit";

// Recursive node-link layout: each person's children render directly
// beneath them in their own container, so CSS flow — not shared rows —
// keeps unrelated branches from ever overlapping or reading as related.
export default function ChartTreeNode({
  person,
  depth = 0,
  collapsed,
  onToggle,
  selectedId,
  onSelect,
  query,
  registerNode,
  forceOpenIds,
}) {
  const hasChildren = (person.children || []).length > 0;
  const isOpen = forceOpenIds.has(person.id) || !collapsed.has(person.id);

  return (
    <div className="cx-node">
      <ChartCoupleUnit
        person={person}
        selectedId={selectedId}
        onSelect={onSelect}
        onToggle={onToggle}
        query={query}
        isOpen={isOpen}
        registerNode={registerNode}
        gen={depth}
      />

      {hasChildren && isOpen && (
        <div className="cx-children">
          {person.children.map((child) => (
            <ChartTreeNode
              key={child.id}
              person={child}
              depth={depth + 1}
              collapsed={collapsed}
              onToggle={onToggle}
              selectedId={selectedId}
              onSelect={onSelect}
              query={query}
              registerNode={registerNode}
              forceOpenIds={forceOpenIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}

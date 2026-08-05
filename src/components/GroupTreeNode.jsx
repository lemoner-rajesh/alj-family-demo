import GroupCoupleUnit from "./GroupCoupleUnit";

// Same recursive, overlap-free layout engine as ChartTreeNode (Option 4),
// with the light "grouped" visual skin instead.
export default function GroupTreeNode({
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
    <div className="grp-node">
      <GroupCoupleUnit
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
        <div className="grp-children">
          {person.children.map((child) => (
            <GroupTreeNode
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

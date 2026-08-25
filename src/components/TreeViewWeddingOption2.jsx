import { useMemo } from "react";
import CoupleUnitWeddingOption2 from "./CoupleUnitWeddingOption2";
import { useMeasuredEdges } from "../useMeasuredEdges";
import { buildVisibleRows, genColorIndex, GENERATION_LABELS } from "../utils/familyUtils";

// Identical to TreeView.jsx except it renders CoupleUnitWeddingOption2
// instead of the landing page's CoupleUnit — see that file for what's
// actually different (only the multi-marriage case).
const genClass = (gen) => `gen-${genColorIndex(gen)}`;

const buildCurvedPath = (x1, y1, x2, y2) => {
  const midY = y1 + (y2 - y1) / 2;
  return `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`;
};

export default function TreeViewWeddingOption2({ root, collapsed, onToggle, selectedId, onSelect, query, forceOpenIds }) {
  const { order, rowMap, edges } = useMemo(
    () => buildVisibleRows(root, collapsed, forceOpenIds),
    [root, collapsed, forceOpenIds]
  );

  const { canvasRef, registerNode, edgePaths, canvasSize } = useMeasuredEdges(edges, buildCurvedPath);

  return (
    <div className="tree-scroll">
      <div className="tree-canvas" ref={canvasRef}>
        <svg className="tree-edges" width={canvasSize.width} height={canvasSize.height} aria-hidden="true">
          {edgePaths.map((p) => (
            <path key={p.id} d={p.d} className={genClass(p.edge.childGen)} />
          ))}
        </svg>

        {order.map((gen) => {
          const people = rowMap.get(gen);
          const label = GENERATION_LABELS[gen] || `Generation ${gen}`;

          return (
            <div className="gen-row" key={gen}>
              <div className={`gen-row__label ${genClass(gen)}`}>
                <span className="gen-row__name">{label}</span>
              </div>
              <div className={`gen-row__cards ${genClass(gen)}`}>
                {people.map(({ person, isGroupStart }) => (
                  <CoupleUnitWeddingOption2
                    key={person.id}
                    person={person}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    query={query}
                    onToggle={onToggle}
                    collapsed={collapsed}
                    forceOpenIds={forceOpenIds}
                    registerNode={registerNode}
                    groupStart={isGroupStart}
                    gen={gen}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

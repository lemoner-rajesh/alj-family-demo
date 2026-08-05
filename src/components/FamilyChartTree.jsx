import { useMemo } from "react";
import ChartTreeNode from "./ChartTreeNode";
import { useMeasuredEdges } from "../useMeasuredEdges";
import { collectEdges } from "../utils/familyUtils";

const buildElbowPath = (x1, y1, x2, y2) => {
  const midY = y1 + (y2 - y1) / 2;
  return `M${x1},${y1} L${x1},${midY} L${x2},${midY} L${x2},${y2}`;
};

export default function FamilyChartTree({ root, collapsed, onToggle, selectedId, onSelect, query, forceOpenIds }) {
  const edges = useMemo(() => collectEdges(root, collapsed, forceOpenIds), [root, collapsed, forceOpenIds]);
  const { canvasRef, registerNode, edgePaths, canvasSize } = useMeasuredEdges(edges, buildElbowPath);

  return (
    <div className="cx-scroll">
      <div className="cx-canvas" ref={canvasRef}>
        <svg className="chart-edges" width={canvasSize.width} height={canvasSize.height} aria-hidden="true">
          {edgePaths.map((p) => (
            <path key={p.id} d={p.d} />
          ))}
        </svg>

        <ChartTreeNode
          person={root}
          collapsed={collapsed}
          onToggle={onToggle}
          selectedId={selectedId}
          onSelect={onSelect}
          query={query}
          registerNode={registerNode}
          forceOpenIds={forceOpenIds}
        />
      </div>
    </div>
  );
}

import { useMemo } from "react";
import ChartCoupleUnit from "./ChartCoupleUnit";
import { useMeasuredEdges } from "../useMeasuredEdges";
import { buildVisibleRows } from "../utils/familyUtils";

const buildElbowPath = (x1, y1, x2, y2) => {
  const midY = y1 + (y2 - y1) / 2;
  return `M${x1},${y1} L${x1},${midY} L${x2},${midY} L${x2},${y2}`;
};

export default function FamilyChartView({ root, collapsed, onToggle, selectedId, onSelect, query, forceOpenIds }) {
  const { order, rowMap, edges } = useMemo(
    () => buildVisibleRows(root, collapsed, forceOpenIds),
    [root, collapsed, forceOpenIds]
  );

  const { canvasRef, registerNode, edgePaths, canvasSize } = useMeasuredEdges(edges, buildElbowPath);

  return (
    <div className="chart-scroll">
      <div className="chart-canvas" ref={canvasRef}>
        <svg className="chart-edges" width={canvasSize.width} height={canvasSize.height} aria-hidden="true">
          {edgePaths.map((p) => (
            <path key={p.id} d={p.d} />
          ))}
        </svg>

        {order.map((gen) => (
          <div className="chart-row" key={gen}>
            {rowMap.get(gen).map(({ person, isGroupStart }) => (
              <ChartCoupleUnit
                key={person.id}
                person={person}
                selectedId={selectedId}
                onSelect={onSelect}
                onToggle={onToggle}
                query={query}
                isOpen={forceOpenIds.has(person.id) || !collapsed.has(person.id)}
                registerNode={registerNode}
                groupStart={isGroupStart}
                gen={gen}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

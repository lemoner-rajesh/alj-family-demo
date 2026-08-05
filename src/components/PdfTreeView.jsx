import { useMemo } from "react";
import PdfCoupleUnit from "./PdfCoupleUnit";
import { useMeasuredEdges } from "../useMeasuredEdges";
import { buildVisibleRows } from "../utils/familyUtils";

const buildElbowPath = (x1, y1, x2, y2) => {
  const midY = y1 + (y2 - y1) / 2;
  return `M${x1},${y1} L${x1},${midY} L${x2},${midY} L${x2},${y2}`;
};

const genCaption = (gen) => {
  if (gen === 0) return "Family Founder";
  if (gen === 1) return "Family Origins";
  return `Family Business Generation ${gen - 1}`;
};

export default function PdfTreeView({ root, collapsed, onToggle, selectedId, onSelect, forceOpenIds }) {
  const { order, rowMap, edges } = useMemo(
    () => buildVisibleRows(root, collapsed, forceOpenIds),
    [root, collapsed, forceOpenIds]
  );

  const { canvasRef, registerNode, edgePaths, canvasSize } = useMeasuredEdges(edges, buildElbowPath);

  return (
    <div className="pdf-scroll">
      <div className="pdf-canvas" ref={canvasRef}>
        <svg className="pdf-edges" width={canvasSize.width} height={canvasSize.height} aria-hidden="true">
          {edgePaths.map((p) => (
            <path key={p.id} d={p.d} />
          ))}
        </svg>

        {order.map((gen) => {
          const people = rowMap.get(gen);
          return (
            <div className="pdf-gen-band" key={gen}>
              <div className="pdf-gen-divider">
                <span className="pdf-gen-label">{genCaption(gen)}</span>
                <span className="pdf-gen-rule" />
              </div>
              <div className="pdf-gen-row">
                {people.map(({ person, isGroupStart }) => (
                  <PdfCoupleUnit
                    key={person.id}
                    person={person}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    onToggle={onToggle}
                    isOpen={forceOpenIds.has(person.id) || !collapsed.has(person.id)}
                    registerNode={registerNode}
                    groupStart={isGroupStart}
                    gen={gen}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <div className="pdf-legend">
          <strong>Key:</strong>
          <span>
            <span className="pdf-card__bio pdf-legend__sample">View Bio: [LINK]</span> = family members publicly
            active in today's businesses or philanthropies
          </span>
          <span>
            <span className="pdf-legend__sample pdf-legend__sample--flag">?</span> = name, date, or relationship
            flagged for further research
          </span>
        </div>
      </div>
    </div>
  );
}

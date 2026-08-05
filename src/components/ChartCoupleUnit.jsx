import { useState } from "react";
import ChartCard from "./ChartCard";
import { matchesQuery, MIN_COLLAPSIBLE_GEN } from "../utils/familyUtils";

export default function ChartCoupleUnit({ person, selectedId, onSelect, onToggle, isOpen, registerNode, query, groupStart, gen }) {
  const [spouseOpen, setSpouseOpen] = useState(true);
  const showToggle = (person.children || []).length > 0 && gen >= MIN_COLLAPSIBLE_GEN;
  const searching = query.trim().length > 0;
  const selfMatch = matchesQuery(person, query) || (person.spouse && matchesQuery(person.spouse, query));

  const spouseMatches = person.spouse && searching && matchesQuery(person.spouse, query);
  const spouseSelected = person.spouse && selectedId === person.spouse.id;
  const showSpouse = person.spouse && (spouseOpen || spouseMatches || spouseSelected);

  return (
    <div className={`chart-couple ${groupStart ? "chart-couple--group-start" : ""}`}>
      {/* Only the marriage pair is measured for connector lines — the expand
          toggle sits below it, right at the point the branch starts. */}
      <div className="chart-couple__pair" ref={(el) => registerNode(person.id, el)}>
        <ChartCard
          person={person}
          isSelected={selectedId === person.id}
          isMatch={searching && matchesQuery(person, query)}
          dimmed={searching && !selfMatch}
          onSelect={onSelect}
        />

        {person.spouse && (
          <button
            type="button"
            className={`chart-marriage ${showSpouse ? "is-open" : "is-collapsed"}`}
            onClick={() => setSpouseOpen((v) => !v)}
            title={showSpouse ? "Hide spouse" : `Show spouse: ${person.spouse.name}`}
          >
            ⚭
          </button>
        )}

        {showSpouse && (
          <ChartCard
            person={person.spouse}
            isSelected={selectedId === person.spouse.id}
            isMatch={searching && matchesQuery(person.spouse, query)}
            dimmed={searching && !selfMatch}
            onSelect={onSelect}
          />
        )}
      </div>

      {showToggle && (
        <button
          type="button"
          className="chart-expand"
          onClick={() => onToggle(person.id)}
          aria-label={isOpen ? "Collapse descendants" : "Expand descendants"}
          title={isOpen ? "Collapse this branch" : `Show ${person.children.length} ${person.children.length === 1 ? "child" : "children"}`}
        >
          {isOpen ? "−" : `+${person.children.length}`}
        </button>
      )}
    </div>
  );
}

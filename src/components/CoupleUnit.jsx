import { useState } from "react";
import PersonCard from "./PersonCard";
import { matchesQuery, MIN_COLLAPSIBLE_GEN } from "../utils/familyUtils";

export default function CoupleUnit({ person, selectedId, onSelect, query, onToggle, isOpen, registerNode, groupStart, gen }) {
  const [spouseOpen, setSpouseOpen] = useState(true);
  const showToggle = (person.children || []).length > 0 && gen >= MIN_COLLAPSIBLE_GEN;
  const searching = query.trim().length > 0;
  const selfMatch = matchesQuery(person, query) || (person.spouse && matchesQuery(person.spouse, query));

  const spouseMatches = person.spouse && searching && matchesQuery(person.spouse, query);
  const spouseSelected = person.spouse && selectedId === person.spouse.id;
  const showSpouse = person.spouse && (spouseOpen || spouseMatches || spouseSelected);

  return (
    <div className={`couple-unit ${groupStart ? "couple-unit--group-start" : ""}`}>
      {/* Only the marriage pair is measured for connector lines — the expand
          toggle must stay outside it, or the anchor point skews toward it. */}
      <div className="couple-unit__pair" ref={(el) => registerNode(person.id, el)}>
        <PersonCard
          person={person}
          isSelected={selectedId === person.id}
          isMatch={searching && matchesQuery(person, query)}
          dimmed={searching && !selfMatch}
          onSelect={onSelect}
        />

        {person.spouse && (
          <button
            type="button"
            className={`marriage-toggle ${showSpouse ? "is-open" : "is-collapsed"}`}
            onClick={() => setSpouseOpen((v) => !v)}
            aria-label={showSpouse ? "Hide spouse" : "Show spouse"}
            title={showSpouse ? "Hide spouse" : `Show spouse: ${person.spouse.name}`}
          >
            M
          </button>
        )}

        {showSpouse && (
          <PersonCard
            person={person.spouse}
            isSpouse
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
          className="toggle-btn"
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

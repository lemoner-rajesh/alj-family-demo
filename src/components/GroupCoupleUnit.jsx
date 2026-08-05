import { useState } from "react";
import GroupCard from "./GroupCard";
import { matchesQuery, genColorIndex, MIN_COLLAPSIBLE_GEN } from "../utils/familyUtils";

// Matches the reference's convention: a couple only gets the light gray
// "group" box (with the corner collapse chevron) when they actually have
// children to collapse — a childless sibling is just a bare photo+tag.
export default function GroupCoupleUnit({ person, selectedId, onSelect, onToggle, isOpen, registerNode, query, gen }) {
  const [spouseOpen, setSpouseOpen] = useState(true);
  const showToggle = (person.children || []).length > 0 && gen >= MIN_COLLAPSIBLE_GEN;
  const searching = query.trim().length > 0;
  const selfMatch = matchesQuery(person, query) || (person.spouse && matchesQuery(person.spouse, query));

  const spouseMatches = person.spouse && searching && matchesQuery(person.spouse, query);
  const spouseSelected = person.spouse && selectedId === person.spouse.id;
  const showSpouse = person.spouse && (spouseOpen || spouseMatches || spouseSelected);
  const genClass = `gen-${genColorIndex(gen)}`;

  const pairContent = (
    <>
      <GroupCard
        person={person}
        isSelected={selectedId === person.id}
        isMatch={searching && matchesQuery(person, query)}
        dimmed={searching && !selfMatch}
        onSelect={onSelect}
        gen={gen}
      />

      {person.spouse && (
        <button
          type="button"
          className={`grp-marriage ${showSpouse ? "is-open" : "is-collapsed"}`}
          onClick={() => setSpouseOpen((v) => !v)}
          title={showSpouse ? "Hide spouse" : `Show spouse: ${person.spouse.name}`}
        >
          −
        </button>
      )}

      {showSpouse && (
        <GroupCard
          person={person.spouse}
          isSelected={selectedId === person.spouse.id}
          isMatch={searching && matchesQuery(person.spouse, query)}
          dimmed={searching && !selfMatch}
          onSelect={onSelect}
          gen={gen}
        />
      )}
    </>
  );

  if (!showToggle) {
    return (
      <div className="grp-pair" ref={(el) => registerNode(person.id, el)}>
        {pairContent}
      </div>
    );
  }

  return (
    <div className={`grp-box ${genClass}`} ref={(el) => registerNode(person.id, el)}>
      <div className="grp-pair">{pairContent}</div>
      <button
        type="button"
        className="grp-collapse"
        onClick={() => onToggle(person.id)}
        aria-label={isOpen ? "Collapse descendants" : "Expand descendants"}
        title={isOpen ? "Collapse this branch" : `Show ${person.children.length} ${person.children.length === 1 ? "child" : "children"}`}
      >
        {isOpen ? "‹" : "›"}
      </button>
    </div>
  );
}

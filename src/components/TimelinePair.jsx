import { useState } from "react";
import PersonCard from "./PersonCard";
import { matchesQuery } from "../utils/familyUtils";

export default function TimelinePair({ person, selectedId, onSelect, query }) {
  const [spouseOpen, setSpouseOpen] = useState(true);
  const searching = query.trim().length > 0;
  const selfMatch = matchesQuery(person, query) || (person.spouse && matchesQuery(person.spouse, query));

  const spouseMatches = person.spouse && searching && matchesQuery(person.spouse, query);
  const spouseSelected = person.spouse && selectedId === person.spouse.id;
  const showSpouse = person.spouse && (spouseOpen || spouseMatches || spouseSelected);

  return (
    <div className="timeline__pair">
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

      {person.children?.length > 0 && <span className="timeline__child-count">↳ {person.children.length} children</span>}
    </div>
  );
}

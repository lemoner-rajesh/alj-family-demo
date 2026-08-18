import { Fragment, useState } from "react";
import PersonCard from "./PersonCard";
import { matchesQuery } from "../utils/familyUtils";

export default function TimelinePair({ person, selectedId, onSelect, query }) {
  const spouses = person.spouses || [];
  const [openSpouseIds, setOpenSpouseIds] = useState(() => new Set(spouses.map((s) => s.id)));
  const searching = query.trim().length > 0;
  const selfMatch = matchesQuery(person, query) || spouses.some((s) => matchesQuery(s, query));

  const toggleSpouse = (id) => {
    setOpenSpouseIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="timeline__pair">
      <PersonCard
        person={person}
        isSelected={selectedId === person.id}
        isMatch={searching && matchesQuery(person, query)}
        dimmed={searching && !selfMatch}
        onSelect={onSelect}
      />

      {spouses.map((spouse) => {
        const spouseMatches = searching && matchesQuery(spouse, query);
        const spouseSelected = selectedId === spouse.id;
        const showSpouse = openSpouseIds.has(spouse.id) || spouseMatches || spouseSelected;

        return (
          <Fragment key={spouse.id}>
            <button
              type="button"
              className={`marriage-toggle ${showSpouse ? "is-open" : "is-collapsed"}`}
              onClick={() => toggleSpouse(spouse.id)}
              aria-label={showSpouse ? "Hide spouse" : "Show spouse"}
              title={showSpouse ? "Hide spouse" : `Show spouse: ${spouse.name}`}
            >
              M
            </button>

            {showSpouse && (
              <PersonCard
                person={spouse}
                isSpouse
                isSelected={selectedId === spouse.id}
                isMatch={spouseMatches}
                dimmed={searching && !selfMatch}
                onSelect={onSelect}
              />
            )}
          </Fragment>
        );
      })}

      {person.children?.length > 0 && <span className="timeline__child-count">↳ {person.children.length} children</span>}
    </div>
  );
}

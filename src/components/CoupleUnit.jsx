import { Fragment, useState } from "react";
import PersonCard from "./PersonCard";
import { matchesQuery, MIN_COLLAPSIBLE_GEN } from "../utils/familyUtils";

export default function CoupleUnit({ person, selectedId, onSelect, query, onToggle, isOpen, registerNode, groupStart, gen }) {
  const spouses = person.spouses || [];
  const [openSpouseIds, setOpenSpouseIds] = useState(() => new Set(spouses.map((s) => s.id)));
  const showToggle = (person.children || []).length > 0 && gen >= MIN_COLLAPSIBLE_GEN;
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

  const spouseStates = spouses.map((spouse) => {
    const spouseMatches = searching && matchesQuery(spouse, query);
    const spouseSelected = selectedId === spouse.id;
    return { spouse, spouseMatches, showSpouse: openSpouseIds.has(spouse.id) || spouseMatches || spouseSelected };
  });

  // With a remarriage (2+ spouses), the first spouse renders on the primary's
  // left instead of stacking every spouse to the right — that keeps the
  // primary person horizontally centered in the pair, which also centers the
  // connector-line anchor below them (it's based on the whole pair's
  // bounding box, not the primary card specifically).
  const beforeState = spouseStates.length > 1 ? spouseStates[0] : null;
  const afterStates = spouseStates.length > 1 ? spouseStates.slice(1) : spouseStates;

  const spouseButton = ({ spouse, showSpouse }) => (
    <button
      type="button"
      className={`marriage-toggle ${showSpouse ? "is-open" : "is-collapsed"}`}
      onClick={() => toggleSpouse(spouse.id)}
      aria-label={showSpouse ? "Hide spouse" : "Show spouse"}
      title={showSpouse ? "Hide spouse" : `Show spouse: ${spouse.name}`}
    >
      M
    </button>
  );

  const spouseCard = ({ spouse, spouseMatches }) => (
    <PersonCard
      person={spouse}
      isSpouse
      isSelected={selectedId === spouse.id}
      isMatch={spouseMatches}
      dimmed={searching && !selfMatch}
      onSelect={onSelect}
    />
  );

  return (
    <div className={`couple-unit ${groupStart ? "couple-unit--group-start" : ""}`}>
      {/* Only the marriage pair is measured for connector lines — the expand
          toggle must stay outside it, or the anchor point skews toward it. */}
      <div className="couple-unit__pair" ref={(el) => registerNode(person.id, el)}>
        {beforeState && (
          <Fragment key={beforeState.spouse.id}>
            {beforeState.showSpouse && spouseCard(beforeState)}
            {spouseButton(beforeState)}
          </Fragment>
        )}

        <PersonCard
          person={person}
          isSelected={selectedId === person.id}
          isMatch={searching && matchesQuery(person, query)}
          dimmed={searching && !selfMatch}
          onSelect={onSelect}
        />

        {afterStates.map((state) => (
          <Fragment key={state.spouse.id}>
            {spouseButton(state)}
            {state.showSpouse && spouseCard(state)}
          </Fragment>
        ))}
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

import { Fragment, useState } from "react";
import PersonCard from "./PersonCard";
import { matchesQuery, groupChildrenBySpouse, MIN_COLLAPSIBLE_GEN } from "../utils/familyUtils";

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

// Wedding Option 1: unlike the landing page's CoupleUnit (which puts the
// first spouse before the primary to keep them visually centered between
// marriages), every spouse renders AFTER the primary here, in marriage
// order, each labeled "1st marriage" / "2nd marriage" above its "M" toggle.
// For anyone with 0 or 1 spouse (everyone except Hayat Jameel right now)
// this renders identically to the landing page — only a remarriage looks
// different, so the two pages are directly comparable on that one row.
export default function CoupleUnitWeddingOption1({ person, selectedId, onSelect, query, onToggle, collapsed, forceOpenIds, registerNode, groupStart, gen }) {
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

  const spouseStates = spouses.map((spouse, index) => {
    const spouseMatches = searching && matchesQuery(spouse, query);
    const spouseSelected = selectedId === spouse.id;
    return { spouse, index, spouseMatches, showSpouse: openSpouseIds.has(spouse.id) || spouseMatches || spouseSelected };
  });

  const canToggle = gen >= MIN_COLLAPSIBLE_GEN;
  const groups = canToggle ? groupChildrenBySpouse(person).filter((g) => g.children.length > 0) : [];
  const defaultGroup = groups.find((g) => g.spouseId === null);
  const groupBySpouseId = new Map(groups.filter((g) => g.spouseId !== null).map((g) => [g.spouseId, g]));

  const isGroupOpen = (group) => forceOpenIds.has(group.key) || !collapsed.has(group.key);

  const renderToggle = (group, extraClass = "") => {
    const open = isGroupOpen(group);
    return (
      <button
        type="button"
        className={`toggle-btn ${extraClass}`}
        onClick={() => onToggle(group.key)}
        aria-label={open ? "Collapse descendants" : "Expand descendants"}
        title={open ? "Collapse this branch" : `Show ${group.children.length} ${group.children.length === 1 ? "child" : "children"}`}
      >
        {open ? "−" : `+${group.children.length}`}
      </button>
    );
  };

  const spouseButton = ({ spouse, index, showSpouse }) => {
    const group = groupBySpouseId.get(spouse.id);
    return (
      <span className="wo1-marriage" ref={(el) => registerNode(`${person.id}:source:${spouse.id}`, el)}>
        {spouses.length > 1 && <span className="wo1-marriage__ordinal">{ORDINALS[index] || `${index + 1}th`} marriage</span>}
        <button
          type="button"
          className={`marriage-toggle ${showSpouse ? "is-open" : "is-collapsed"}`}
          onClick={() => toggleSpouse(spouse.id)}
          aria-label={showSpouse ? "Hide spouse" : "Show spouse"}
          title={showSpouse ? "Hide spouse" : `Show spouse: ${spouse.name}`}
        >
          M
        </button>
        {group && renderToggle(group, "toggle-btn--marriage")}
      </span>
    );
  };

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
      <div className="couple-unit__pair" ref={(el) => registerNode(`${person.id}:source`, el)}>
        <PersonCard
          person={person}
          isSelected={selectedId === person.id}
          isMatch={searching && matchesQuery(person, query)}
          dimmed={searching && !selfMatch}
          onSelect={onSelect}
          cardRef={(el) => registerNode(person.id, el)}
        />

        {spouseStates.map((state) => (
          <Fragment key={state.spouse.id}>
            {spouseButton(state)}
            {state.showSpouse && spouseCard(state)}
          </Fragment>
        ))}
      </div>

      {defaultGroup && renderToggle(defaultGroup)}
    </div>
  );
}

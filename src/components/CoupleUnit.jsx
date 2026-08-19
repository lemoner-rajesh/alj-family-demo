import { Fragment, useState } from "react";
import PersonCard from "./PersonCard";
import { matchesQuery, groupChildrenBySpouse, MIN_COLLAPSIBLE_GEN } from "../utils/familyUtils";

export default function CoupleUnit({ person, selectedId, onSelect, query, onToggle, collapsed, forceOpenIds, registerNode, groupStart, gen }) {
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

  // A remarriage tags each child with `parentSpouseId` (which marriage they
  // came from) — see groupChildrenBySpouse. That splits the expand/collapse
  // toggle too: each marriage gets its OWN toggle at its OWN departure
  // point, so "collapse Saif's 4 kids" and "collapse Marwan's 1 kid" are
  // independent instead of one shared toggle that can't tell the two
  // marriages apart. Someone with 0 or 1 spouse (almost everyone) always
  // produces exactly one untagged group, rendered as the single centered
  // toggle exactly as before.
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

  // Registered as `${person.id}:source:${spouse.id}` — a dedicated departure
  // point for THIS specific marriage, separate from the whole-pair
  // `${person.id}:source` node. Only matters when a child is tagged with
  // `parentSpouseId` (a remarriage, e.g. Hayat Jameel): without it, all of a
  // remarried person's children would depart from one ambiguous point
  // instead of branching from the marriage they actually came from.
  //
  // The ref goes on the `.couple-unit__marriage` WRAPPER, not the small "M"
  // button itself — the wrapper is stretched (`align-self: stretch`) to the
  // full row height, so its bottom edge lands at the same reference point
  // the row's own bottom edge does. That's the same reference the *default*
  // toggle's line uses (the whole pair's bottom), and it's what the
  // per-marriage toggle button is positioned against too (`bottom: 0` on
  // `.toggle-btn--marriage`). Anchoring on the "M" button's own tiny,
  // vertically-centered box instead left the line ending well above the
  // toggle circle instead of touching it — a visible gap the single-marriage
  // case never had, since there the toggle already shares the pair's own
  // bottom edge as its reference.
  const spouseButton = ({ spouse, showSpouse }) => {
    const group = groupBySpouseId.get(spouse.id);
    return (
      <span className="couple-unit__marriage" ref={(el) => registerNode(`${person.id}:source:${spouse.id}`, el)}>
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
      {/* Two different anchors, deliberately. `${person.id}:source` marks
          the whole pair (primary + spouse cards + "M" toggles) — every card
          is the same fixed width, so for the common one-spouse case its
          center lands right on the "M" glyph, matching the source chart's
          branch-drops-from-the-marriage convention. Plain `person.id` marks
          only the primary's own card, used when this person is someone
          ELSE's child — an incoming line from their own parent must land on
          their card, not drift onto their marriage with their own spouse. */}
      <div className="couple-unit__pair" ref={(el) => registerNode(`${person.id}:source`, el)}>
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
          cardRef={(el) => registerNode(person.id, el)}
        />

        {afterStates.map((state) => (
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

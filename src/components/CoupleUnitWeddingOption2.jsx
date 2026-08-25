import PersonCard from "./PersonCard";
import { matchesQuery, groupChildrenBySpouse, lifeSpan, MIN_COLLAPSIBLE_GEN } from "../utils/familyUtils";

// Wedding Option 2: a remarriage (2+ spouses) renders as two boxes stacked
// vertically — Box 1 is the primary's own card, enlarged; Box 2 sits below
// it, a single bordered container split into two side-by-side halves (not
// two separate cards, and not chips). Each spouse half is always visible
// (no per-marriage show/hide "M" toggle — there's nothing left to hide once
// spouses aren't full cards) and still carries its own descendant
// expand/collapse toggle and its own connector departure point. Anyone with
// 0 or 1 spouse renders through the exact same single-card path as the
// landing page, so only Hayat Jameel's row differs.
export default function CoupleUnitWeddingOption2({ person, selectedId, onSelect, query, onToggle, collapsed, forceOpenIds, registerNode, groupStart, gen }) {
  const spouses = person.spouses || [];
  const searching = query.trim().length > 0;
  const selfMatch = matchesQuery(person, query) || spouses.some((s) => matchesQuery(s, query));

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

  if (spouses.length > 1) {
    return (
      <div className={`couple-unit ${groupStart ? "couple-unit--group-start" : ""}`}>
        <div className="wo2-group" ref={(el) => registerNode(`${person.id}:source`, el)}>
          <div className="wo2-primary-box">
            <PersonCard
              person={person}
              isSelected={selectedId === person.id}
              isMatch={searching && matchesQuery(person, query)}
              dimmed={searching && !selfMatch}
              onSelect={onSelect}
              cardRef={(el) => registerNode(person.id, el)}
            />
          </div>

          <span className="marriage-toggle is-open" aria-hidden="true">
            M
          </span>

          <div className="wo2-stack">
            {spouses.map((spouse) => {
              const spouseMatches = searching && matchesQuery(spouse, query);
              return (
                <button
                  type="button"
                  key={spouse.id}
                  className={`wo2-stack__spouse ${selectedId === spouse.id ? "is-selected" : ""} ${spouseMatches ? "is-match" : ""}`}
                  onClick={() => onSelect(spouse)}
                >
                  <span className="wo2-stack__name">{spouse.name}</span>
                  <span className="wo2-stack__years">{lifeSpan(spouse)}</span>
                </button>
              );
            })}
          </div>

          {/* Toggles hang below Box 2, one per spouse half, instead of
              living inside each half — matching how every other descendant
              toggle in the app hangs below its box rather than sitting
              embedded inside it. */}
          <div className="wo2-toggle-row">
            {spouses.map((spouse) => {
              const group = groupBySpouseId.get(spouse.id);
              return (
                <div className="wo2-toggle-cell" key={spouse.id}>
                  {group && (
                    <button
                      type="button"
                      className="toggle-btn"
                      ref={(el) => registerNode(`${person.id}:source:${spouse.id}`, el)}
                      onClick={() => onToggle(group.key)}
                      aria-label={isGroupOpen(group) ? "Collapse descendants" : "Expand descendants"}
                      title={
                        isGroupOpen(group)
                          ? "Collapse this branch"
                          : `Show ${group.children.length} ${group.children.length === 1 ? "child" : "children"}`
                      }
                    >
                      {isGroupOpen(group) ? "−" : `+${group.children.length}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {defaultGroup && renderToggle(defaultGroup)}
      </div>
    );
  }

  const spouse = spouses[0] || null;
  const spouseMatches = spouse && searching && matchesQuery(spouse, query);

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

        {spouse && (
          <>
            <span className="marriage-toggle is-open" aria-hidden="true">
              M
            </span>
            <PersonCard person={spouse} isSpouse isSelected={selectedId === spouse.id} isMatch={spouseMatches} dimmed={searching && !selfMatch} onSelect={onSelect} />
          </>
        )}
      </div>

      {defaultGroup && renderToggle(defaultGroup)}
    </div>
  );
}

import { avatarColor, genColorIndex, lifeSpan } from "../utils/familyUtils";

export default function GroupCard({ person, isSelected, isMatch, dimmed, onSelect, gen }) {
  return (
    <button
      type="button"
      className={[
        "grp-card",
        person.unverified ? "grp-card--u" : `gen-${genColorIndex(gen)}`,
        isSelected ? "is-selected" : "",
        isMatch ? "is-match" : "",
        dimmed ? "is-dimmed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onSelect(person)}
    >
      <span className="grp-card__avatar" style={person.unverified ? undefined : { background: avatarColor(person) }}>
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <circle cx="12" cy="8.5" r="4" fill="#fff" fillOpacity="0.95" />
          <path d="M4 20.3c0-4.13 3.58-7.3 8-7.3s8 3.17 8 7.3" fill="#fff" fillOpacity="0.95" />
        </svg>
        {person.hasBio && <span className="grp-card__bio-dot" title="View Bio" />}
        {person.unverified && (
          <span className="grp-card__flag-dot" title="Unverified">
            ?
          </span>
        )}
      </span>

      <span className="grp-card__tag">
        <span className="grp-card__name">{person.name}</span>
        <span className="grp-card__years">{lifeSpan(person)}</span>
      </span>
    </button>
  );
}

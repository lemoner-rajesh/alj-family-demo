import { avatarColor, lifeSpan } from "../utils/familyUtils";

export default function ChartCard({ person, isSelected, isMatch, dimmed, onSelect }) {
  const genderClass = person.unverified ? "chart-card--u" : person.gender === "f" ? "chart-card--f" : "chart-card--m";

  return (
    <button
      type="button"
      className={[
        "chart-card",
        genderClass,
        isSelected ? "is-selected" : "",
        isMatch ? "is-match" : "",
        dimmed ? "is-dimmed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onSelect(person)}
    >
      <span className="chart-card__avatar" style={{ background: avatarColor(person) }}>
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <circle cx="12" cy="8.5" r="4" fill="#fff" fillOpacity="0.95" />
          <path d="M4 20.3c0-4.13 3.58-7.3 8-7.3s8 3.17 8 7.3" fill="#fff" fillOpacity="0.95" />
        </svg>
      </span>

      {person.hasBio && <span className="chart-card__bio-dot" title="View Bio" />}
      {person.unverified && (
        <span className="chart-card__flag-dot" title="Unverified">
          ?
        </span>
      )}

      <span className="chart-card__years">{lifeSpan(person)}</span>
      <span className="chart-card__name">{person.name}</span>

      <span className="chart-card__menu" aria-hidden="true">
        •••
      </span>
    </button>
  );
}

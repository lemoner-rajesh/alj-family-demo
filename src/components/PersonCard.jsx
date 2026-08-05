import { lifeSpan } from "../utils/familyUtils";

export default function PersonCard({ person, isSpouse, isSelected, isMatch, dimmed, onSelect }) {
  return (
    <button
      type="button"
      className={[
        "person-card",
        isSpouse ? "person-card--spouse" : "",
        person.unverified ? "person-card--unverified" : "",
        isSelected ? "is-selected" : "",
        isMatch ? "is-match" : "",
        dimmed ? "is-dimmed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onSelect(person)}
    >
      <span className="person-card__name">{person.name}</span>
      <span className="person-card__years">{lifeSpan(person)}</span>
      <span className="person-card__badges">
        {person.hasBio && <span className="badge badge--bio">View Bio</span>}
        {person.unverified && <span className="badge badge--unverified">Unverified</span>}
      </span>
    </button>
  );
}

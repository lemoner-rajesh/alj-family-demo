import { lifeSpan } from "../utils/familyUtils";

export default function PersonCard({ person, isSpouse, isSelected, isMatch, dimmed, onSelect }) {
  return (
    <button
      type="button"
      className={[
        "person-card",
        isSpouse ? "person-card--spouse" : "",
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
      <span className="person-card__badges">{person.hasBio && <span className="badge badge--bio">View Bio</span>}</span>
    </button>
  );
}

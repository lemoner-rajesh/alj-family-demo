import { lifeSpan } from "../utils/familyUtils";

export default function PdfPersonCard({ person, isSpouse, isSelected, onSelect }) {
  return (
    <button
      type="button"
      className={[
        "pdf-card",
        isSpouse ? "pdf-card--spouse" : "",
        person.unverified ? "pdf-card--unverified" : "",
        isSelected ? "is-selected" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onSelect(person)}
    >
      {person.unverified && <span className="pdf-card__flag">?</span>}

      <span className="pdf-card__name">
        {person.name}
        {person.unverified && !person.fullName && !person.name.startsWith("Unnamed") && " (FULL NAME?)"}
      </span>

      {person.fullName && <span className="pdf-card__fullname">({person.fullName})</span>}

      <span className="pdf-card__years">({lifeSpan(person)})</span>

      {person.hasBio && <span className="pdf-card__bio">View Bio: [LINK]</span>}

      {person.businesses && person.businesses.length > 0 && (
        <span className="pdf-card__businesses">
          {person.businesses.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </span>
      )}
    </button>
  );
}

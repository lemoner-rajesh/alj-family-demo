import { GENERATION_LABELS } from "../utils/familyUtils";

export default function Legend() {
  return (
    <div className="legend">
      <span className="legend__item">
        <span className="badge badge--bio">View Bio</span>
        family members publicly active in today's businesses or philanthropies
      </span>
      <span className="legend__item">
        <span className="badge badge--unverified">Unverified</span>
        name, dates, or relationship flagged for further research
      </span>
      <span className="legend__item">
        <span className="marriage-glyph marriage-glyph--static">⚭</span>
        marriage
      </span>

      <span className="legend__gens">
        {GENERATION_LABELS.map((label, gen) => (
          <span className="legend__gen" key={label}>
            <span className={`legend__dot gen-${Math.min(gen, 4)}`} />
            {label}
          </span>
        ))}
      </span>
    </div>
  );
}

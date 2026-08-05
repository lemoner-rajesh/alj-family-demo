import { GENERATION_LABELS } from "../utils/familyUtils";

export default function Legend({ hint }) {
  return (
    <div className="legend">
      <span className="legend__item">
        <span className="marriage-glyph marriage-glyph--static">M</span>
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

      {hint && <span className="legend__hint">{hint}</span>}
    </div>
  );
}

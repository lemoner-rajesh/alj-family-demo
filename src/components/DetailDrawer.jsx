import { genColorIndex, lifeSpan } from "../utils/familyUtils";
import PersonPhoto from "./PersonPhoto";

export default function DetailDrawer({ person, gen, generationLabel, relations, onClose, onJump }) {
  if (!person) return null;

  const genClass = `gen-${genColorIndex(gen)}`;

  return (
    <aside className="drawer" role="dialog" aria-label={`${person.name} details`}>
      <div className={`drawer__photo ${genClass}`}>
        <PersonPhoto person={person} />
      </div>

      <button type="button" className="drawer__close" onClick={onClose} aria-label="Close">
        ×
      </button>

      <div className="drawer__header">
        <span className="drawer__gen">{generationLabel}</span>
        <h2>{person.name}</h2>
        {person.fullName && <p className="drawer__fullname">{person.fullName}</p>}
        <p className="drawer__years">{lifeSpan(person)}</p>
      </div>

      <div className="drawer__body">
        {person.note && (
          <div className="drawer__note">
            <p>{person.note}</p>
          </div>
        )}

        {person.hasBio && (
          <div className="drawer__section">
            <h3>Biography</h3>
            <p className="drawer__bio-text">
              {person.bio || (
                <>
                  Full biography content for {person.name} would be loaded here in the production
                  application — this prototype uses placeholder text to demonstrate the interaction.
                </>
              )}
            </p>
          </div>
        )}

        {person.businesses && person.businesses.length > 0 && (
          <div className="drawer__section">
            <h3>Business &amp; philanthropy affiliations</h3>
            <div className="chip-row">
              {person.businesses.map((b) => (
                <a className="chip-link" key={b} href={`https://${b}`} target="_blank" rel="noopener noreferrer">
                  {b}
                </a>
              ))}
            </div>
          </div>
        )}

        {person.relatedMentions && person.relatedMentions.length > 0 && (
          <div className="drawer__section">
            <h3>In-laws mentioned nearby</h3>
            <p className="drawer__hint">Named in the source chart next to this entry — not shown as tree branches.</p>
            <ul className="mention-list">
              {person.relatedMentions.map((m) => (
                <li key={m.name}>
                  {m.name}
                  {m.hasBio && <span className="badge badge--bio mention-list__badge">View Bio</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {relations.spouses && relations.spouses.length > 0 && (
          <div className="drawer__section">
            <h3>{relations.spouses.length > 1 ? `Spouses (${relations.spouses.length})` : "Spouse"}</h3>
            <ul className="relation-list">
              {relations.spouses.map((s) => (
                <li key={s.id}>
                  <button type="button" className="relation-link" onClick={() => onJump(s)}>
                    <span>{s.name}</span>
                    <span className="relation-link__arrow">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {relations.children && relations.children.length > 0 && (
          <div className="drawer__section">
            <h3>Children ({relations.children.length})</h3>
            <ul className="relation-list">
              {relations.children.map((c) => (
                <li key={c.id}>
                  <button type="button" className="relation-link" onClick={() => onJump(c)}>
                    <span>{c.name}</span>
                    <span className="relation-link__arrow">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}

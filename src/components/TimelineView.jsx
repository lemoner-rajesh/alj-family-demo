import TimelinePair from "./TimelinePair";
import { flattenPeople, GENERATION_LABELS } from "../utils/familyUtils";

export default function TimelineView({ root, selectedId, onSelect, query }) {
  const flat = flattenPeople(root).filter((entry) => !entry.isSpouse);
  const byGeneration = new Map();
  flat.forEach((entry) => {
    if (!byGeneration.has(entry.generation)) byGeneration.set(entry.generation, []);
    byGeneration.get(entry.generation).push(entry.person);
  });

  return (
    <div className="timeline">
      {[...byGeneration.entries()].map(([gen, people]) => (
        <div className="timeline__lane" key={gen}>
          <div className="timeline__label">
            <span className="timeline__dot" />
            {GENERATION_LABELS[gen] || `Generation ${gen}`}
            <span className="timeline__count">{people.length}</span>
          </div>
          <div className="timeline__row">
            {people.map((person) => (
              <TimelinePair key={person.id} person={person} selectedId={selectedId} onSelect={onSelect} query={query} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

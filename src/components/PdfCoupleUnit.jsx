import { useState } from "react";
import PdfPersonCard from "./PdfPersonCard";
import { MIN_COLLAPSIBLE_GEN } from "../utils/familyUtils";

export default function PdfCoupleUnit({ person, selectedId, onSelect, onToggle, isOpen, registerNode, groupStart, gen }) {
  const [spouseOpen, setSpouseOpen] = useState(true);
  const showToggle = (person.children || []).length > 0 && gen >= MIN_COLLAPSIBLE_GEN;
  const spouseSelected = person.spouse && selectedId === person.spouse.id;
  const showSpouse = person.spouse && (spouseOpen || spouseSelected);

  return (
    <div className={`pdf-couple ${groupStart ? "pdf-couple--group-start" : ""}`}>
      <div className="pdf-couple__pair" ref={(el) => registerNode(person.id, el)}>
        <PdfPersonCard person={person} isSelected={selectedId === person.id} onSelect={onSelect} />

        {person.spouse && (
          <span className="pdf-marriage" aria-label="Married">
            <span className="pdf-marriage__line" />
            <button
              type="button"
              className={`pdf-marriage__m ${showSpouse ? "is-open" : "is-collapsed"}`}
              onClick={() => setSpouseOpen((v) => !v)}
              title={showSpouse ? "Hide spouse" : `Show spouse: ${person.spouse.name}`}
            >
              M
            </button>
            {showSpouse && <span className="pdf-marriage__line" />}
          </span>
        )}

        {showSpouse && (
          <PdfPersonCard
            person={person.spouse}
            isSpouse
            isSelected={selectedId === person.spouse.id}
            onSelect={onSelect}
          />
        )}
      </div>

      {showToggle && (
        <button type="button" className="pdf-toggle" onClick={() => onToggle(person.id)}>
          {isOpen ? "[ – collapse ]" : `[ + ${person.children.length} ]`}
        </button>
      )}
    </div>
  );
}

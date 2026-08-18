import avatarMale from "../assets/avatar-male.png";
import avatarFemale from "../assets/avatar-female.png";

// Generic bust used when gender isn't recorded — no headwear implied.
function NeutralPlaceholder() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="36" r="18" fill="currentColor" />
      <path d="M50 58c-23 0-42 15-42 34v8h84v-8c0-19-19-34-42-34z" fill="currentColor" />
    </svg>
  );
}

// Renders a real photo when available, otherwise a generic silhouette
// placeholder — shared by PersonCard and DetailDrawer so both stay
// consistent. Sizing/shape is controlled by the caller's wrapper element.
export default function PersonPhoto({ person }) {
  if (person.photoUrl) {
    return <img src={person.photoUrl} alt="" />;
  }

  if (person.gender === "m") return <img className="person-photo--placeholder" src={avatarMale} alt="" />;
  if (person.gender === "f") return <img className="person-photo--placeholder" src={avatarFemale} alt="" />;
  return <NeutralPlaceholder />;
}

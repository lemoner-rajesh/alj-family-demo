export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"
        />
      </svg>
      <input
        type="text"
        value={value}
        placeholder="Search by name or business…"
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search family members"
      />
      {value && (
        <button type="button" className="search-bar__clear" onClick={() => onChange("")} aria-label="Clear search">
          ×
        </button>
      )}
    </div>
  );
}

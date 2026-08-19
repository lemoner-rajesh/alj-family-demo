// Single source of truth for the family tree is familyData.json — this file
// just loads it and derives the small bits of runtime state the app needs.
// Keeping the data in JSON (rather than JS object literals) means it can be
// swapped for a fetch() from a real API/CMS later without touching this
// shape: every person already carries the full field set (bio, photoUrl,
// businesses, etc.) instead of relying on JS-only factory defaults.
import familyData from "./familyData.json";

export const familyRoot = familyData;

// Generation-3 branches with the most great-grandchildren are collapsed by
// default so the initial tree view isn't overwhelming — driven by each
// person's own `defaultCollapsed` flag in the JSON rather than a hardcoded
// id list, so it stays correct if the data changes.
function collectDefaultCollapsedIds(person, acc = []) {
  if (person.defaultCollapsed) acc.push(person.id);
  (person.spouses || []).forEach((spouse) => collectDefaultCollapsedIds(spouse, acc));
  (person.children || []).forEach((child) => collectDefaultCollapsedIds(child, acc));
  return acc;
}

export const defaultCollapsedIds = collectDefaultCollapsedIds(familyRoot);

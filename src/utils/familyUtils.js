// Flattens the family tree and provides lookup helpers used for search,
// stats, and the timeline view. Generation 0 = family founder, 1 = origins,
// 2–5 map to the "Family Business Generation 1–4" bands on the source chart.

export function flattenPeople(root, generation = 0, parentPath = []) {
  const path = [...parentPath, root.id];
  let list = [{ person: root, generation, isSpouse: false, path }];

  if (root.spouse) {
    list.push({ person: root.spouse, generation, isSpouse: true, path });
  }

  for (const child of root.children || []) {
    list = list.concat(flattenPeople(child, generation + 1, path));
  }

  return list;
}

export function buildIndex(root) {
  const flat = flattenPeople(root);
  const byId = new Map();
  flat.forEach((entry) => byId.set(entry.person.id, entry));
  return byId;
}

export function matchesQuery(person, query) {
  if (!query) return false;
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return (
    person.name.toLowerCase().includes(q) ||
    (person.fullName && person.fullName.toLowerCase().includes(q)) ||
    (person.businesses || []).some((b) => b.toLowerCase().includes(q))
  );
}

export function lifeSpan(person) {
  const born = person.born || "YYYY";
  const died = person.died ? person.died : person.died === 0 ? "0" : "";
  if (!person.born && !person.died) return "YYYY – YYYY";
  return `${born} – ${died}`;
}

export function searchOpenPath(root, query) {
  const open = new Set();
  if (!query.trim()) return open;
  const flat = flattenPeople(root);
  for (const entry of flat) {
    const target = entry.isSpouse ? entry.person : entry.person;
    if (matchesQuery(target, query)) {
      entry.path.forEach((id) => open.add(id));
    }
  }
  return open;
}

export function getRelations(index, person) {
  const entry = index.get(person.id);
  if (!entry) return { spouse: null, children: [] };

  if (entry.isSpouse) {
    const primaryId = entry.path[entry.path.length - 1];
    const primary = index.get(primaryId).person;
    return { spouse: primary, children: primary.children || [] };
  }

  return { spouse: person.spouse || null, children: person.children || [] };
}

// Each row entry carries `isGroupStart` — true when it's the first of a
// new parent's children in that row — so renderers can add a visual gap
// between sibling clusters that belong to different parents. Without it,
// once several branches are expanded side by side, cousins and siblings
// end up spaced identically and it's unclear who belongs to whom.
export function buildVisibleRows(root, collapsed, forceOpenIds) {
  const order = [];
  const rowMap = new Map();
  const edges = [];
  const isOpen = (person) => forceOpenIds.has(person.id) || !collapsed.has(person.id);

  function walk(person, gen, parentId) {
    if (!rowMap.has(gen)) {
      rowMap.set(gen, []);
      order.push(gen);
    }
    const row = rowMap.get(gen);
    const isGroupStart = row.length > 0 && row[row.length - 1].parentId !== parentId;
    row.push({ person, parentId, isGroupStart });

    const kids = person.children || [];
    if (kids.length > 0 && isOpen(person)) {
      kids.forEach((child) => {
        edges.push({ parentId: person.id, childId: child.id, childGen: gen + 1 });
        walk(child, gen + 1, person.id);
      });
    }
  }

  walk(root, 0, null);
  return { order, rowMap, edges };
}

export const GENERATION_LABELS = [
  "Family Founder",
  "Origins",
  "Generation 1",
  "Generation 2",
  "Generation 3",
  "Generation 4",
];

// Maps a raw tree depth to the 0–4 color slot used across the app —
// the founder and origins rows both use the muted "gen-0" color.
export function genColorIndex(gen) {
  return Math.max(0, Math.min(gen - 1, 4));
}

// The Founder (0) and Origins (1) rows are a single-child chain with no
// real siblings — collapsing either one hides essentially the entire tree,
// which reads as the whole page breaking rather than a useful collapse.
// Every renderer hides the toggle above this depth.
export const MIN_COLLAPSIBLE_GEN = 2;

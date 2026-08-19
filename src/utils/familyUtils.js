// Flattens the family tree and provides lookup helpers used for search,
// stats, and the timeline view. Generation 0 = family founder, 1 = origins,
// 2–5 map to the "Family Business Generation 1–4" bands on the source chart.

export function flattenPeople(root, generation = 0, parentPath = []) {
  const path = [...parentPath, root.id];
  let list = [{ person: root, generation, isSpouse: false, path }];

  (root.spouses || []).forEach((spouse) => {
    list.push({ person: spouse, generation, isSpouse: true, path });
  });

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
  if (!entry) return { spouses: [], children: [] };

  if (entry.isSpouse) {
    const primaryId = entry.path[entry.path.length - 1];
    const primary = index.get(primaryId).person;
    return { spouses: [primary], children: primary.children || [] };
  }

  return { spouses: person.spouses || [], children: person.children || [] };
}

// Groups a person's children by which marriage they came from, via each
// child's `parentSpouseId` (only set for a remarriage, e.g. Hayat Jameel's
// kids). Children with no tag fall into one default group keyed by the
// person's own id — the common case, behaviorally identical to having one
// undivided child list. Each group gets its own expand/collapse state and
// its own connector-line departure point, so "collapse Saif's kids" and
// "collapse Marwan's kid" are independent instead of one combined toggle
// that can't tell the two marriages apart.
export function groupChildrenBySpouse(person) {
  const children = person.children || [];
  const bySpouseId = new Map();
  const defaultChildren = [];

  children.forEach((child) => {
    if (child.parentSpouseId) {
      if (!bySpouseId.has(child.parentSpouseId)) bySpouseId.set(child.parentSpouseId, []);
      bySpouseId.get(child.parentSpouseId).push(child);
    } else {
      defaultChildren.push(child);
    }
  });

  const groups = [];
  if (defaultChildren.length > 0 || bySpouseId.size === 0) {
    groups.push({ key: person.id, spouseId: null, children: defaultChildren });
  }
  bySpouseId.forEach((kids, spouseId) => {
    groups.push({ key: `${person.id}:${spouseId}`, spouseId, children: kids });
  });
  return groups;
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
  const isGroupOpen = (group) => forceOpenIds.has(group.key) || !collapsed.has(group.key);

  function walk(person, gen, parentId) {
    if (!rowMap.has(gen)) {
      rowMap.set(gen, []);
      order.push(gen);
    }
    const row = rowMap.get(gen);
    const isGroupStart = row.length > 0 && row[row.length - 1].parentId !== parentId;
    row.push({ person, parentId, isGroupStart });

    groupChildrenBySpouse(person).forEach((group) => {
      if (group.children.length > 0 && isGroupOpen(group)) {
        group.children.forEach((child) => {
          edges.push({ parentId: person.id, childId: child.id, childGen: gen + 1, spouseId: group.spouseId });
          walk(child, gen + 1, person.id);
        });
      }
    });
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

// Only the Founder (0) is a lone single-child link with no siblings —
// collapsing it hides essentially the entire tree, which reads as the page
// breaking rather than a useful collapse. Origins (1) onward do have real
// value in collapsing, so the toggle is hidden only for depth 0.
export const MIN_COLLAPSIBLE_GEN = 1;

import snapshot from "./intact-jobs.json";

// Keep the original census for provenance; every published opportunity must
// explicitly list Montréal. A neighbouring city alone does not qualify.
const roles = snapshot.roles
  .filter((role) =>
    role.locations.some((location) => location.city === "Montréal"),
  )
  .map((role) => ({
    ...role,
    locations: role.locations.filter(
      (location) => location.city === "Montréal",
    ),
  }));
const categories: Record<string, number> = {};
for (const role of roles)
  categories[role.category] = (categories[role.category] ?? 0) + 1;

const montreal = {
  meta: {
    ...snapshot.meta,
    uniqueRequisitions: roles.length,
    countryCounts: { Canada: roles.length },
    cityCounts: { Montréal: roles.length },
    categories,
    coverage:
      "Montréal-listed roles only, including multi-office postings that explicitly offer Montréal.",
  },
  roles,
};
export default montreal;

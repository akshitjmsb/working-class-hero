"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
type CatalogueRole = {
  id: string;
  title: string;
  summary: string;
  department: string;
  skills: string[];
  category: string;
  employment: string;
  locations: { city: string; country: string }[];
  salary: number[] | null;
  url: string;
};
type CatalogueSnapshot = {
  roles: CatalogueRole[];
  meta: {
    cityCounts: Record<string, number>;
    categories: Record<string, number>;
  };
};
const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export default function IntactRoleCatalogue({
  snapshot,
}: {
  snapshot: CatalogueSnapshot;
}) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [track, setTrack] = useState("");
  const [page, setPage] = useState(0);
  const rows = useMemo(
    () =>
      snapshot.roles.filter(
        (r) =>
          (!query ||
            fold(
              [r.title, r.id, r.summary, r.department, ...r.skills].join(" "),
            ).includes(fold(query))) &&
          (!city || r.locations.some((l) => l.city === city)) &&
          (!category || r.category === category) &&
          (!track ||
            (track === "Student"
              ? r.employment.includes("Internship")
              : track === "Development"
                ? r.employment.includes("development")
                : track === "Contract"
                  ? /contract|secondment|replacement/i.test(r.employment)
                  : r.locations.some((l) => l.country === "Canada"))),
      ),
    [query, city, category, track, snapshot.roles],
  );
  const current = Math.min(page, Math.max(0, Math.ceil(rows.length / 20) - 1));
  return (
    <>
      <div className="research-filters">
        <label>
          Search roles, skills or requisition
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="e.g. business analyst, Python, R155432"
          />
        </label>
        <label>
          Office city
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setPage(0);
            }}
          >
            <option value="">All offices</option>
            {Object.keys(snapshot.meta.cityCounts)
              .sort()
              .map((c) => (
                <option key={c}>{c}</option>
              ))}
          </select>
        </label>
        <label>
          Career category
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
            }}
          >
            <option value="">All categories</option>
            {Object.keys(snapshot.meta.categories)
              .sort()
              .map((c) => (
                <option key={c}>{c}</option>
              ))}
          </select>
        </label>
        <label>
          Route / geography
          <select
            value={track}
            onChange={(e) => {
              setTrack(e.target.value);
              setPage(0);
            }}
          >
            <option value="">All postings</option>
            <option value="Canada">Canada</option>
            <option value="Student">Internships / co-ops</option>
            <option value="Development">Development programmes</option>
            <option value="Contract">Contracts / replacements</option>
          </select>
        </label>
      </div>
      <p role="status" className="research-meta">
        {rows.length} of {snapshot.roles.length} postings · Snapshot: September
        13, 2026 · Search includes description summaries and skill signals.
      </p>
      {!rows.length && (
        <p>
          No matching roles.{" "}
          <button
            className="research-button"
            onClick={() => {
              setQuery("");
              setCity("");
              setCategory("");
              setTrack("");
              setPage(0);
            }}
          >
            Clear filters
          </button>
        </p>
      )}
      <div>
        {rows.slice(current * 20, current * 20 + 20).map((r) => (
          <article key={r.id} className="research-role">
            <details>
              <summary>
                {r.title}
                <div className="research-meta">
                  {r.id} · {r.locations.map((l) => l.city).join(" / ")} ·{" "}
                  {r.salary
                    ? `$${r.salary[0].toLocaleString("en-CA")}–$${r.salary[1].toLocaleString("en-CA")}`
                    : "Salary not captured"}
                </div>
              </summary>
              <p>{r.summary}</p>
              <p className="research-small">
                {r.category} · {r.department} · {r.employment}
              </p>
              <p>
                <Link href={`/target-companies/intact/roles/${r.id}`}>
                  Read requirements and role details
                </Link>{" "}
                · <a href={r.url}>Original full job description</a>
              </p>
            </details>
          </article>
        ))}
      </div>
      {rows.length > 20 && (
        <div className="research-pagination">
          <button
            className="research-button"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            Previous
          </button>
          <span>
            Page {current + 1} of {Math.ceil(rows.length / 20)}
          </span>
          <button
            className="research-button"
            disabled={(current + 1) * 20 >= rows.length}
            onClick={() => setPage(current + 1)}
          >
            Next
          </button>
        </div>
      )}
      <noscript>
        Use the complete role directory below to open any job without
        interactive filters.
      </noscript>
      <details>
        <summary>
          Complete directory — all {snapshot.roles.length} role pages
        </summary>
        <ul>
          {snapshot.roles.map((r) => (
            <li key={r.id}>
              <Link href={`/target-companies/intact/roles/${r.id}`}>
                {r.id} · {r.title}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}

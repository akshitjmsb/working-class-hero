"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
type Role = {
  id: string;
  title: string;
  category: string;
  summary: string;
  requirements: string;
  skills: string[];
  employment: string;
  posted: string;
  salary: number[] | null;
};
const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export default function BRPRoleCatalogue({ roles }: { roles: Role[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0);
  const rows = useMemo(
    () =>
      roles.filter(
        (r) =>
          (!query ||
            fold(
              [r.title, r.id, r.summary, r.requirements, ...r.skills].join(" "),
            ).includes(fold(query))) &&
          (!category || r.category === category),
      ),
    [query, category, roles],
  );
  const current = Math.min(page, Math.max(0, Math.ceil(rows.length / 15) - 1));
  return (
    <>
      <div className="research-filters">
        <label>
          Search work, requirements or ID
          <input
            value={query}
            placeholder="e.g. CRM, CPA, SAP, 36447"
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
          />
        </label>
        <div>
          <strong>Office scope</strong>
          <p>Montréal only</p>
        </div>
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
            {[...new Set(roles.map((r) => r.category))].sort().map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <button
          className="research-button"
          onClick={() => {
            setQuery("");
            setCategory("");
            setPage(0);
          }}
        >
          Clear filters
        </button>
      </div>
      <p role="status">
        {rows.length} of {roles.length} Montréal requisitions · Checked
        September 19, 2026
      </p>
      {rows.length === 0 && (
        <p>No matching roles. Clear filters to see the full catalogue.</p>
      )}
      {rows.slice(current * 15, current * 15 + 15).map((r) => (
        <details key={r.id}>
          <summary>
            {r.title}
            <div className="research-meta">
              {r.id} · {r.category} · Posted {r.posted}
            </div>
          </summary>
          <p>{r.summary}</p>
          <p>
            <strong>Requirements:</strong> {r.requirements}
          </p>
          <p>
            {r.employment} ·{" "}
            {r.salary
              ? `CAD $${r.salary[0].toLocaleString("en-CA")}–$${r.salary[1].toLocaleString("en-CA")}`
              : "Salary band not published in captured description"}
          </p>
          <Link href={`/target-companies/brp/roles/${r.id}`}>
            Read role analysis and official descriptions →
          </Link>
        </details>
      ))}
      {rows.length > 15 && (
        <div className="research-pagination">
          <button
            className="research-button"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            Previous
          </button>
          <span>
            Page {current + 1} of {Math.ceil(rows.length / 15)}
          </span>
          <button
            className="research-button"
            disabled={(current + 1) * 15 >= rows.length}
            onClick={() => setPage(current + 1)}
          >
            Next
          </button>
        </div>
      )}
      <details>
        <summary>Complete directory — all {roles.length} roles</summary>
        <ul>
          {roles.map((r) => (
            <li key={r.id}>
              <Link href={`/target-companies/brp/roles/${r.id}`}>
                {r.id} · {r.title}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}

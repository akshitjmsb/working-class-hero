import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import data from "@/lib/target-companies/brp-jobs.json";
export function generateStaticParams() {
  return data.roles.map((r) => ({ id: r.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const r = data.roles.find((r) => r.id === id);
  return {
    title: r
      ? `${r.title} | BRP Montréal | People Are Strange`
      : "Role not found",
    description: r?.summary,
  };
}
export default async function RolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = data.roles.find((r) => r.id === id);
  if (!r) notFound();
  return (
    <article className="research-role">
      <p>
        <Link href="/target-companies/brp#roles">← BRP Montréal dossier</Link>
      </p>
      <h1>{r.title}</h1>
      <p className="research-meta">
        Requisition {r.id} · Posted {r.posted} · Checked September 19, 2026
      </p>
      <p>{r.summary}</p>
      <p>
        <a className="research-button" href={r.url}>
          Full official description and application
        </a>
        {r.url !== r.frenchUrl && (
          <>
            {" "}
            <a href={r.frenchUrl}>French description</a>
          </>
        )}
      </p>
      <section className="research-section">
        <h2>Requirements and entry conditions</h2>
        <p>{r.requirements}</p>
        <p>
          These are original summaries of the employer’s conditions. Consult the
          full description for alternatives, detailed proficiency levels and
          updates. No résumé matching has been performed.
        </p>
        <h3>Technical and professional topics</h3>
        <p>
          {r.skills.map((s) => (
            <span className="research-pill" key={s}>
              {s}
            </span>
          ))}
        </p>
        <p className="research-small">
          Topics are not all mandatory; the requirement summary distinguishes
          stated assets where relevant.
        </p>
      </section>
      <section className="research-section">
        <h2>Role facts</h2>
        <dl>
          {[
            ["Official category", r.category],
            ["Department", r.department],
            ["Published level", r.level],
            ["Employment", r.employment],
            ["Hours", r.hours],
            ["Work arrangement", r.workModel],
            [
              "Base salary",
              r.salary
                ? `CAD $${r.salary[0].toLocaleString("en-CA")}–$${r.salary[1].toLocaleString("en-CA")} annually`
                : "No numerical range found in the captured description",
            ],
            [
              "Bonus",
              "A company-results-based annual bonus is described; no target percentage verified. Eligibility and offer terms need confirmation.",
            ],
            ["Reporting / team evidence", r.reporting],
            ["Source language", r.sourceLanguage],
            [
              "Application timing",
              "Listed on the check date. No future closing date verified; recheck the employer page before applying.",
            ],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      {r.cautions.length > 0 && (
        <section className="research-section">
          <h2>Details to resolve</h2>
          <ul>
            {r.cautions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      )}
      <section className="research-section">
        <h2>Montréal office</h2>
        <p>{data.meta.office}</p>
        <p>
          This requisition explicitly lists Montréal. The address is verified
          through BRP’s{" "}
          <a href="https://www.brp.com/fr/notre-entreprise/bureaux.html">
            office directory
          </a>
          ; confirm your contractual base, weekly attendance and any travel.
          Nearby-city-only openings are excluded.
        </p>
      </section>
      <section className="research-section">
        <h2>Questions for the hiring team</h2>
        <ul>
          <li>
            Who owns requisition {r.id}, and how does this position fit into the
            current team?
          </li>
          <li>
            What would you need this person to deliver in the first 90 days?
          </li>
          <li>
            Which requirements are essential on arrival, and what training is
            available?
          </li>
          <li>
            What are the salary band, bonus eligibility, hours, office days and
            travel commitments?
          </li>
          <li>
            Is this a new position, a replacement or part of a larger
            recruitment campaign?
          </li>
        </ul>
        <p>
          <Link href="/target-companies/brp#people">
            See the evidence-based people map
          </Link>
          . A team association does not automatically establish the final hiring
          decision-maker.
        </p>
      </section>
      <section className="research-section">
        <h2>Evidence</h2>
        <p>
          <a href={r.url}>BRP official requisition {r.id}</a>, accessed{" "}
          {r.checked}. Descriptions are paraphrased here; the employer hosts the
          full text. Status is a dated observation rather than continuous
          monitoring.
        </p>
      </section>
    </article>
  );
}

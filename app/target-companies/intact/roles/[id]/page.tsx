import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import snapshot from "@/lib/target-companies/intact-jobs.json";
export function generateStaticParams() {
  return snapshot.roles.map((r) => ({ id: r.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const r = snapshot.roles.find((r) => r.id === id);
  return {
    title: r ? `${r.title} | Intact | People Are Strange` : "Role not found",
    description: r?.summary,
  };
}
export default async function RolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = snapshot.roles.find((r) => r.id === id);
  if (!r) notFound();
  return (
    <article className="research-role">
      <p>
        <Link href="/target-companies/intact#roles">
          ← Intact role catalogue
        </Link>
      </p>
      <h1>{r.title}</h1>
      <p className="research-meta">
        {r.id} · {r.brand} · Posted {r.posted} · Checked September 13, 2026
      </p>
      <p>{r.summary}</p>
      <p>
        <a className="research-button" href={r.url}>
          Read full official job description
        </a>{" "}
        <a className="research-button" href={r.applyUrl}>
          Open official application
        </a>
      </p>
      <div className="research-callout">
        <strong>Timing</strong>
        <p>{r.timing}</p>
        {r.cautions.map((c) => (
          <p key={c}>{c}</p>
        ))}
      </div>
      <section className="research-section">
        <h2>Role facts</h2>
        <dl>
          <div>
            <dt>Official category / business unit</dt>
            <dd>
              {r.category} / {r.department}
            </dd>
          </div>
          <div>
            <dt>Employment</dt>
            <dd>{r.employment}</dd>
          </div>
          <div>
            <dt>Published base salary range</dt>
            <dd>
              {r.salary
                ? `$${r.salary[0].toLocaleString("en-CA")}–$${r.salary[1].toLocaleString("en-CA")} ${r.locations.every((l) => l.country === "Canada") ? "CAD" : ""}`
                : "Not captured in the source salary field"}
            </dd>
          </div>
          <div>
            <dt>Annual bonus target</dt>
            <dd>
              {r.bonus === null
                ? "Not captured"
                : `${r.bonus}% of base; performance and eligibility conditions apply`}
            </dd>
          </div>
          <div>
            <dt>Work arrangement</dt>
            <dd>{r.workModel}</dd>
          </div>
          <div>
            <dt>Language</dt>
            <dd>{r.language}</dd>
          </div>
          <div>
            <dt>Hiring manager</dt>
            <dd>{r.hiringManager}</dd>
          </div>
          <div>
            <dt>Evidence status</dt>
            <dd>{r.status} on the check date; availability can change.</dd>
          </div>
        </dl>
        <p className="research-small">
          Published salary bands are not guaranteed offers. Canadian
          descriptions commonly state a 35-hour basis; verify the hours,
          contract eligibility and any location conditions in this requisition.
          A full-time label does not establish permanent employment.
        </p>
      </section>
      <section className="research-section">
        <h2>Qualifications</h2>
        {r.gates.length > 0 && (
          <ul>
            {r.gates.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        )}
        <h3>Additional signals</h3>
        <p>
          These highlights help compare roles. The original description
          determines which conditions are mandatory, preferred, alternative or
          location-specific.
        </p>
        <dl>
          <div>
            <dt>Experience figures mentioned</dt>
            <dd>
              {r.experienceSignals.length
                ? r.experienceSignals.join(" · ")
                : "No numerical experience figure extracted; this does not imply no experience is needed."}
            </dd>
          </div>
          <div>
            <dt>Education references</dt>
            <dd>
              {r.educationSignals.length
                ? r.educationSignals.join(" · ")
                : "See the original education and equivalency conditions."}
            </dd>
          </div>
        </dl>
        <h3>Tools, credentials and technical topics mentioned</h3>
        <p>
          {r.skills.length
            ? r.skills.map((s) => (
                <span key={s} className="research-pill">
                  {s}
                </span>
              ))
            : "No named tools or credentials captured in the selected keyword set."}
        </p>
        <p className="research-small">
          A mention is not automatically a must-have. Some topics describe the
          work, some are assets, and some are alternatives. This page does not
          rank the role against a résumé.
        </p>
      </section>
      <section className="research-section">
        <h2>Listed office options</h2>
        <ul>
          {r.locations.map((l, i) => (
            <li key={i}>
              {l.address}, {l.city}, {l.province}, {l.country}
            </li>
          ))}
        </ul>
        <p>
          Multiple locations describe options on one requisition, not separate
          vacancies. For field roles, confirm the service territory and travel
          expectations; the administrative office can be elsewhere.
        </p>
      </section>
      <section className="research-section">
        <h2>Clarify with the recruiting team</h2>
        <ul>
          <li>
            Which team and named manager own {r.id}, and is this a new position
            or replacement?
          </li>
          <li>
            What would successful performance look like during the first three
            months?
          </li>
          <li>
            Which listed skills are non-negotiable, and which can be learned
            after joining?
          </li>
          <li>
            Which office is the contractual base, and what attendance, travel or
            on-call commitments apply?
          </li>
          <li>
            Is the posting still accepting applications, how many people will it
            hire, and what is the expected start date?
          </li>
        </ul>
        <p>
          These are suggested questions, not claims about the interview format.{" "}
          <Link href="/target-companies/intact#people">
            See verified leaders and hiring leads
          </Link>
          .
        </p>
      </section>
      <section className="research-section research-sources">
        <h2>Source</h2>
        <p>
          Intact Careers,{" "}
          <a href={r.url}>
            {r.title} ({r.id})
          </a>
          . Official listing and job description accessed {r.checked}. Role
          summary is a paraphrase; use the linked employer page for the complete
          description and current application status.
        </p>
      </section>
    </article>
  );
}

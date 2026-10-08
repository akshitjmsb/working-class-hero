import { COMPANY_RESEARCH_PHASES as phases } from "@/lib/company-research-framework";
import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Company research framework | Working Class Hero",
  description:
    "A reusable, evidence-based method for researching target employers, every opening, job requirements and hiring ownership.",
};

export default function FrameworkPage() {
  return (
    <>
      <p className="research-meta">
        REUSABLE PLAYBOOK · VERSION 1 · SEPTEMBER 13, 2026
      </p>
      <h1>Target-company research framework</h1>
      <p>
        This is the method used for{" "}
        <Link href="/target-companies/intact">Intact</Link>, designed to be
        repeated for another employer. The aim is to understand the company’s
        work and hiring landscape before making candidate-fit decisions.
      </p>
      <div className="research-callout">
        <strong>Three distinct evidence layers</strong>
        <p>
          <b>Observed facts:</b> what an accessible, dated source says.{" "}
          <b>Analysis:</b> what those facts suggest. <b>Unknowns:</b> what
          cannot yet be established. Keep those layers visible throughout the
          report.
        </p>
      </div>
      {phases.map(([title, method, output]) => (
        <section className="research-section" key={title}>
          <h2>{title}</h2>
          <p>{method}</p>
          <p className="research-small">
            <strong>Output:</strong> {output}
          </p>
        </section>
      ))}
      <section className="research-section">
        <h2>People: evidence classes</h2>
        <div className="research-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Minimum evidence</th>
                <th>Permitted claim</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Confirmed requisition owner</td>
                <td>
                  Current official description, current first-person post naming
                  that requisition, or direct confirmation.
                </td>
                <td>
                  Named hiring manager for the exact role, with check date.
                </td>
              </tr>
              <tr>
                <td>Team-level hiring evidence</td>
                <td>
                  A first-person hiring post naming a team or related work,
                  without a verified current ID match.
                </td>
                <td>
                  Potential team lead; ownership of current opening unconfirmed.
                </td>
              </tr>
              <tr>
                <td>Recruiting lead</td>
                <td>
                  Current public employer affiliation and recruiting role or
                  activity.
                </td>
                <td>Possible routing contact; assigned vacancies unknown.</td>
              </tr>
              <tr>
                <td>Executive oversight</td>
                <td>Current official biography or leadership directory.</td>
                <td>Organisational remit; not the vacancy’s hiring manager.</td>
              </tr>
              <tr>
                <td>Historical / stale</td>
                <td>
                  Old post, former employer, departure announcement or
                  superseded title.
                </td>
                <td>
                  Historical context only; exclude from current-contact lists.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Do not guess email patterns, gather private details or send outreach
          as part of research. Outreach is a separate user-authorised action.
        </p>
      </section>
      <section className="research-section">
        <h2>Reusable role record</h2>
        <p>
          Use stable identifiers and explicit nulls. “Not found” means the
          research did not establish a value; it is not a negative factual
          claim.
        </p>
        <div className="research-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Group</th>
                <th>Fields</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Identity",
                  "Company, brand, hiring system, requisition ID, title, canonical URL, application URL",
                ],
                [
                  "Provenance",
                  "Checked-at timestamp, source type, observed status, source date, extraction notes",
                ],
                [
                  "Organisation",
                  "Official category, department, reporting line, manager name and evidence class",
                ],
                [
                  "Location",
                  "All cities, addresses, country, work arrangement, territory, travel / schedule",
                ],
                [
                  "Employment",
                  "Permanent / fixed term / internship / programme, hours, start, closing date and timezone",
                ],
                [
                  "Compensation",
                  "Currency, annual or hourly basis, minimum, maximum, bonus target, conditions",
                ],
                [
                  "Work",
                  "Original responsibility summary, deliverables, stakeholders, business problem",
                ],
                [
                  "Requirements",
                  "Required, preferred, alternatives, experience, education, language, licences, tools",
                ],
                [
                  "Exceptions",
                  "Conflicting fields, uncertain deadlines, missing data, follow-up question",
                ],
              ].map(([a, b]) => (
                <tr key={a}>
                  <td>{a}</td>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="research-section">
        <h2>Quality checks before calling it complete</h2>
        <ul>
          <li>
            The scope names each included hiring system and discloses
            exclusions.
          </li>
          <li>
            Unique-ID count reconciles with the board total or the mismatch is
            explained.
          </li>
          <li>
            Every captured posting has an original summary and a linked employer
            description.
          </li>
          <li>
            Multi-office postings count once; number of postings is not
            presented as number of hires.
          </li>
          <li>
            Country, currency, timing and employment conditions are not inferred
            from defaults.
          </li>
          <li>
            Named people have sources, current-employer checks and evidence
            labels.
          </li>
          <li>
            Known contradictions remain visible, and unknowns are not filled
            with guesses.
          </li>
          <li>
            The published site routes, role pages, filters and navigation have
            been checked.
          </li>
          <li>
            The report states when the research was performed and how to refresh
            it.
          </li>
        </ul>
      </section>
      <section className="research-section">
        <h2>BRP: improvements to the method</h2>
        <p>
          The <Link href="/target-companies/brp">BRP application</Link> adds
          explicit locale checks, reconciliation of unstable pagination, and
          resolution of recruiter short links to exact requisitions. Its 49
          Montréal IDs include two French-only postings with salary bands.
          Always inspect the actual response language, deduplicate by ID rather
          than title, and compare the recruiter’s linked ID with the current
          local vacancy.
        </p>
      </section>
      <section className="research-section">
        <h2>Intact baseline and what a future pass should add</h2>
        <p>
          The Intact dossier covers 125 Montréal-listed requisitions selected
          from the September 13, 2026 board census. Twenty-four have additional
          curated qualification gates. No named current requisition owner was
          established. Future research should deepen Montréal team ownership and
          requirements within this same geographic scope. Preserve the broader
          raw census for provenance without displaying other-city roles.
        </p>
        <p>
          The implementation record is maintained in{" "}
          <code>docs/research/target-company-framework.md</code>, alongside the
          dated Intact research notes. This framework does not create an
          automatic monitoring schedule.
        </p>
        <p>
          <Link href="/target-companies/intact">
            Return to the Intact dossier →
          </Link>
        </p>
      </section>
    </>
  );
}

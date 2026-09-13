import type { Metadata } from "next";
import Link from "next/link";
import IntactRoleCatalogue from "@/components/IntactRoleCatalogue";
import data from "@/lib/target-companies/intact-montreal";
export const metadata: Metadata = {
  title: "Intact | Target Companies | People Are Strange",
  description:
    "125 Montréal Intact job descriptions, company analysis, salary bands, offices and evidence-based hiring leads. September 13, 2026.",
};
const corporate = "https://www.intactfc.com";
function Role({ id }: { id: string }) {
  const r = data.roles.find((r) => r.id === id);
  return r ? (
    <Link href={`/target-companies/intact/roles/${id}`}>
      {r.title} · {id}
    </Link>
  ) : null;
}
const families = [
  [
    "Technology",
    "The largest category combines software engineering, architecture, infrastructure, cybersecurity, data science, product and design. These are distinct professions: production ML engineering, employee IT services and customer-facing digital products have different portfolios and interview evidence. Search the department as well as the title.",
    "R155488",
  ],
  [
    "Claims",
    "Work spans first notification, investigation, coverage decisions, settlement, field appraisal, litigation support and operational leadership. Some roles provide insurance training; others require specialist claims experience or licences. Customer contact, negotiation and difficult loss situations are central to many positions.",
    "R155541",
  ],
  [
    "Finance",
    "The inventory includes investment analysis, accounting, reporting, planning and compensation-related finance work. Excel appears broadly, but CPA, investment credentials and management experience are role-specific. Investment analysis and financial reporting should be treated as separate career tracks.",
    "R155588",
  ],
  [
    "Actuarial & Risk Management",
    "Pricing, reserving, modelling, risk and actuarial leadership form a specialist track with their own education, exam and technical expectations. Internship routes should be separated from qualified and management hiring.",
    "R155471",
  ],
  [
    "Project Management",
    "The category includes portfolio, business analysis, change and delivery work. A product title can refer to internal IT investment governance rather than a consumer application. Read the mandate before inferring the team or portfolio required.",
    "R155432",
  ],
  [
    "Sales & Customer Service",
    "Licensed insurance advice, inbound sales and customer support combine service with regulated products and operating schedules. Training may be available, but office availability, language, shift coverage and licence conditions can still be gates.",
    "",
  ],
  [
    "Legal",
    "Legal hiring includes specialist counsel and supporting work. Bar membership, jurisdiction, litigation or insurance knowledge need to be checked individually. These positions are not interchangeable with claims handling even when they support the same loss file.",
    "",
  ],
  [
    "Marketing & Communications",
    "The work covers customer growth, brand, communications and digital experience. Commercial outcomes, channel knowledge and evidence of delivered work matter differently across these functions. Do not assume a marketing leader owns every design or analytics requisition.",
    "R153590",
  ],
  [
    "Underwriting",
    "Underwriters select and price risks, manage broker relationships and exercise delegated authority. Graduate programmes offer an explicit entry route; experienced roles can require product expertise and insurance education.",
    "R155445",
  ],
  [
    "Administration & Operations",
    "Office, facilities and operational support roles can have substantially different attendance expectations from technology. An office-support title does not imply an entry-level position.",
    "R155573",
  ],
  [
    "Human Resources",
    "The snapshot includes specialist people work. Compensation, HR data and learning design need different experience; general enthusiasm for HR does not replace the technical requirements in these descriptions.",
    "R155481",
  ],
];
export default function IntactPage() {
  return (
    <>
      <p className="research-meta">
        TARGET COMPANY 01 · PRIORITY 1 · RESEARCHED SEPTEMBER 13, 2026
      </p>
      <h1>Intact Financial Corporation</h1>
      <p>
        A Montréal-focused investigation of the employer, its open work and the
        people around that work. Your résumé has not been used to filter or rank
        the opportunities.
      </p>
      <div className="research-stats">
        {[
          [125, "Montréal postings"],
          [41, "Technology roles"],
          [19, "Claims roles"],
          [14, "Internships / co-ops"],
        ].map(([n, label]) => (
          <div className="research-stat" key={label}>
            <strong>{n}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="research-callout">
        <strong>Read this as a dated census, not a live feed.</strong>
        <p>
          Only roles explicitly listing Montréal are included: 125 requisitions
          from the September 13 snapshot. Multi-office postings qualify when
          Montréal is an option. Laval, Saint-Hyacinthe and other cities alone
          do not qualify. The original board-wide census is retained for source
          provenance. Confirm the Montréal office arrangement before applying.{" "}
          <a href="https://careers.intactfc.com/jobs">
            Verify current availability on Intact Careers
          </a>
          .
        </p>
      </div>
      <nav className="research-nav" aria-label="Dossier sections">
        {[
          ["company", "Company"],
          ["market", "Hiring landscape"],
          ["roles", "125 Montréal roles"],
          ["pathways", "Entry routes"],
          ["pay", "Pay & conditions"],
          ["locations", "Offices"],
          ["people", "People & ownership"],
          ["process", "Hiring process"],
          ["exceptions", "Important discrepancies"],
          ["actions", "Research conclusions"],
          ["sources", "Sources & coverage"],
        ].map(([id, label]) => (
          <a href={`#${id}`} key={id}>
            {label}
          </a>
        ))}
      </nav>
      <section id="company" className="research-section">
        <h2>What Intact is, and what drives the work</h2>
        <p>
          Intact is a property and casualty insurance group with Canadian, UK /
          Ireland and US operations. Its 2025 annual report describes
          approximately 32,000 employees and $25.1 billion in operating direct
          premiums written, distributed 69% Canada, 19% UK / Ireland and 12% US.
          Canada represented $17.2 billion, with an estimated 18% market share
          based on 2024 data. These are group business figures, not this board’s
          hiring coverage.{" "}
          <a href={`${corporate}/presentations/Intact_AnnualReport_2025.pdf`}>
            2025 annual report, overview and strategy
          </a>
          .
        </p>
        <p>
          The portfolio spans personal auto, personal property, commercial and
          specialty insurance. Canadian employer names include Intact Insurance,
          belairdirect and BrokerLink. The 2025 report describes the UK
          rebranding of RSA, NIG and FarmWeb under Intact. Its stated values are
          integrity, respect, customer focus, excellence and generosity. The
          strategic themes include underwriting discipline, distribution, claims
          capabilities and data-enabled decisions.{" "}
          <a href={`${corporate}/presentations/Intact_AnnualReport_2025.pdf`}>
            Annual report
          </a>
          .
        </p>
        <p>
          The latest quarterly release reviewed here is July 28, 2026: operating
          premium growth of 4%, a 94.9% combined ratio, operating return on
          equity of 17% and a $3.8 billion capital margin. Elevated catastrophe
          and large losses affected results. A combined ratio below 100%
          indicates an underwriting profit before investment income. This
          supports a picture of a substantial operating franchise exposed to
          claims volatility; it does not establish that every team is expanding.{" "}
          <a href="https://newsroom.intactfc.com/2026-07-28-Intact-Financial-Corporation-reports-Q2-2026-results">
            Q2 2026 results
          </a>
          .
        </p>
        <h3>Why an insurer has so many technology roles</h3>
        <p>
          Intact Lab describes a business that builds digital insurance
          experiences and deploys AI into operations. Its corporate page reports
          more than 600 data experts and 575 production AI models. The careers
          technology page uses a different, lower model count, so these should
          be treated as published corporate claims with different update dates.
          Neither number is a verified current headcount of open jobs.{" "}
          <a href={`${corporate}/about-us/intact-lab`}>Intact Lab</a> ·{" "}
          <a href="https://careers.intactfc.com/tech-lab">Technology careers</a>
          .
        </p>
        <p>
          <strong>Analysis:</strong> The common business problem is making
          insurance decisions and service more effective: quoting and
          distribution, selecting risk, handling losses, detecting patterns, and
          supporting employees. A strong company-level understanding should
          connect a technical or operational deliverable to those outcomes. The
          actual posting inventory, rather than the AI branding alone, is the
          evidence for where recruitment is happening.
        </p>
      </section>
      <section id="market" className="research-section">
        <h2>Where the openings are</h2>
        <p>
          The official category mix is heavily weighted toward technology and
          claims: 60 of 125 Montréal postings together. Category labels come
          from the board and do not always match a reader’s intuitive job
          family.
        </p>
        <div className="research-bars">
          {Object.entries(data.meta.categories).map(([name, n]) => (
            <div className="research-bar" key={name}>
              <span>{name}</span>
              <strong>{n}</strong>
              <meter
                min={0}
                max={41}
                value={n}
                aria-label={`${name}: ${n} postings`}
              />
            </div>
          ))}
        </div>
        <p className="research-meta">
          Derived from the official snapshot. Office counts overlap; category
          counts partition the 125 Montréal requisitions.
        </p>
        <div className="research-grid">
          {families.map(([name, description, id]) => (
            <article key={name}>
              <h3>{name}</h3>
              <p>{description}</p>
              {id && (
                <p className="research-small">
                  Example: <Role id={id} />
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
      <section id="roles" className="research-section">
        <h2>Every Montréal opening</h2>
        <p>
          Search all 125 Montréal roles. Each has its own page with an original
          summary, office addresses, salary and bonus fields where published,
          employment conditions, requirement signals, timing notes and the
          employer’s complete job description. Twenty-four selected roles also
          have a closer breakdown of qualification gates. Keyword signals alone
          are not proof that a skill is mandatory.
        </p>
        <IntactRoleCatalogue
          snapshot={{
            meta: {
              cityCounts: data.meta.cityCounts,
              categories: data.meta.categories,
            },
            roles: data.roles.map(
              ({
                id,
                title,
                summary,
                department,
                skills,
                category,
                employment,
                locations,
                salary,
                url,
              }) => ({
                id,
                title,
                summary,
                department,
                skills,
                category,
                employment,
                locations: locations.map(({ city, country }) => ({
                  city,
                  country,
                })),
                salary,
                url,
              }),
            ),
          }}
        />
      </section>
      <section id="pathways" className="research-section">
        <h2>Entry routes and progression</h2>
        <div className="research-grid">
          <article>
            <h3>Insurance training routes</h3>
            <p>
              <Role id="R155541" /> offers training for auto claims, but its
              licence wording needs clarification. <Role id="R155445" /> is a
              two-year underwriting development programme with a June 2027
              start, a defined graduation window, transcripts and insurance
              study expectations. These are structured routes with eligibility
              gates.
            </p>
          </article>
          <article>
            <h3>Students and co-ops</h3>
            <p>
              Fourteen Montréal postings are identified as internships or co-ops
              in the snapshot. Student status, programme requirements, work-term
              availability and location can matter as much as technical skills.
              Several winter 2027 positions specify September 25 application
              timing; one has an inconsistent year. Check each role’s timing
              note.
            </p>
          </article>
          <article>
            <h3>Early professional work</h3>
            <p>
              <Role id="R155588" /> states 0–2 years but also calls for advanced
              investment-related education; low experience does not mean no
              specialist preparation. <Role id="R155612" /> is a six-month
              claims-assistant contract with an experience requirement.
            </p>
          </article>
          <article>
            <h3>Experienced specialist and leadership work</h3>
            <p>
              Product, design, business analysis, finance and people roles often
              require several years of directly relevant delivery.{" "}
              <Role id="R155488" /> asks for substantial product design
              experience; <Role id="R155432" /> centres on an internal IT
              services portfolio. Manager and director roles add functional
              depth and leadership requirements.
            </p>
          </article>
        </div>
        <p>
          <strong>Interpretation:</strong> Choose a route by the work and its
          hard gates first: student eligibility, credentials, language,
          schedule, location and domain expertise. A title-only search hides
          viable routes and mixes incompatible ones. This is a map of
          opportunities, not a candidate-fit recommendation.
        </p>
      </section>
      <section id="pay" className="research-section">
        <h2>Compensation and employment conditions</h2>
        <p>
          The Montréal selection captures 122 published salary ranges and 106
          bonus targets. The examples below are Canadian annual base ranges;
          bonuses are targets, not guaranteed compensation. Contract
          eligibility, hours and location conditions remain governed by the
          individual description.
        </p>
        <div className="research-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Base range, CAD</th>
                <th>Bonus target</th>
                <th>Requirement / condition to notice</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["R155612", "1 year; six-month contract"],
                ["R155541", "Training and conflicting licence language"],
                ["R155573", "On site five days; 35 hours"],
                ["R155445", "Graduate window; June 2027 programme"],
                ["R155588", "0–2 years; specialist education"],
                ["R155130", "3 years; vendor and procurement work"],
                ["R155488", "5+ years; Figma; AI experience preferred"],
                ["R155432", "7 years; IT portfolio mandate"],
                ["R155550", "CPA; 7 years and management experience"],
                ["R154868", "5 years; production ML and advanced education"],
                ["R155222", "CPA; 15 years"],
              ].map(([id, note]) => {
                const r = data.roles.find((r) => r.id === id)!;
                return (
                  <tr key={id}>
                    <td>
                      <Role id={id} />
                    </td>
                    <td>
                      {r.salary
                        ?.map((n) => `$${n.toLocaleString("en-CA")}`)
                        .join("–")}
                    </td>
                    <td>{r.bonus === null ? "Not captured" : `${r.bonus}%`}</td>
                    <td>{note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <h3>What “hybrid” and “full-time” do not resolve</h3>
        <p>
          88 Montréal descriptions contain an explicit hybrid tag. That does not
          establish a universal attendance policy. Facilities work can require
          five days on site, field work can require travel, and a listed office
          can differ from the territory served. Full-time also describes hours
          rather than contract duration: this board includes fixed-term
          replacements and six-month support work.
        </p>
        <p>
          Benefits language is not a substitute for an offer. Confirm pension or
          savings arrangements, leave, insurance, bonus eligibility, probation,
          licence support and professional development for the specific employee
          class and country. The technology careers page describes learning and
          internal development opportunities; it does not guarantee a transfer
          or promotion timeline.{" "}
          <a href="https://careers.intactfc.com/tech-lab">Technology careers</a>
          .
        </p>
      </section>
      <section id="locations" className="research-section">
        <h2>Montréal office and proximity</h2>
        <p>
          All 125 included requisitions list 2020 boulevard Robert-Bourassa,
          Suite 100, Montréal. A role can also advertise other offices; this
          dossier shows its Montréal option only.
        </p>
        <p>
          Confirm that Montréal can be your contractual base and ask about
          attendance, travel and any field territory. No home address or commute
          time has been assumed. Roles offered only in Laval, Saint-Hyacinthe,
          Dorval or another city are outside your stated search.
        </p>
      </section>
      <section id="people" className="research-section">
        <h2>Who leads the organisation—and who may help identify a team</h2>
        <div className="research-callout">
          <strong>
            No named hiring manager was verified for any of the 125 Montréal
            requisitions.
          </strong>
          <p>
            Executive oversight, a public recruiter profile and a historical
            “join my team” post are different kinds of evidence. The people
            below are useful research leads; none is presented as the confirmed
            owner of a current vacancy without that link.
          </p>
        </div>
        <h3>Current leadership map</h3>
        <p>
          Names and positions were checked against the current{" "}
          <a href={`${corporate}/corporate-governance/board-and-leadership`}>
            official leadership directory
          </a>
          . Older executive pages and search snippets can show superseded
          positions.
        </p>
        <div className="research-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Person</th>
                <th>Current published position</th>
                <th>Relevance</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Charles Brindamour",
                  "Chief Executive Officer",
                  "Group direction",
                ],
                [
                  "Louis Gagnon",
                  "Chief Executive Officer, Canada",
                  "Canadian business leadership",
                ],
                [
                  "Patrick Barbeau",
                  "Chief Operating Officer",
                  "Claims, technology and labs oversight",
                ],
                [
                  "Ken Anderson",
                  "Executive Vice President & Chief Financial Officer",
                  "Group finance",
                ],
                [
                  "Carla Smith",
                  "Executive Vice President, Chief People & Communications Officer",
                  "People and communications",
                ],
                [
                  "Peter Janzen",
                  "President, Intact Insurance",
                  "Insurance business",
                ],
                [
                  "Marie-Lucie Paradis",
                  "Executive Vice President & President, Customer Service & Distribution",
                  "Customer service and distribution",
                ],
                [
                  "Benoit Morissette",
                  "Executive Vice President, Chief Risk & Actuarial Officer",
                  "Risk and actuarial",
                ],
                [
                  "Stephanie Lee",
                  "Executive Vice President & Chief Legal Officer",
                  "Legal",
                ],
                [
                  "Werner Muehlemann",
                  "Executive Vice President & Managing Director, Intact Investment Management",
                  "Investment management",
                ],
                [
                  "Frédéric Cotnoir",
                  "Executive Vice President & President, BrokerLink",
                  "BrokerLink",
                ],
                [
                  "Emmanuel Clarke",
                  "Chief Executive Officer, Global Specialty Lines",
                  "Specialty business",
                ],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((v) => (
                    <td key={v}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Patrick Barbeau’s{" "}
          <a
            href={`${corporate}/corporate-governance/board-and-leadership/patrick-barbeau`}
          >
            official biography
          </a>{" "}
          connects his remit to claims, technology and the labs. Carla Smith’s{" "}
          <a
            href={`${corporate}/corporate-governance/board-and-leadership/carla-smith`}
          >
            biography
          </a>{" "}
          establishes her current people and communications remit. These are
          organisational anchors, not suggested first contacts for individual
          applications.
        </p>
        <h3>Public team and recruiting leads</h3>
        <div className="research-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Person / source</th>
                <th>Evidence</th>
                <th>Useful next verification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <a href="https://www.linkedin.com/posts/mbellerive_hi-network-i-am-hiring-for-two-new-opportunities-activity-7378518341768069121-WauI">
                    Mathieu Bellerive
                  </a>
                </td>
                <td>
                  Historical first-person hiring for product operations and
                  design operations; other public posts discuss AI product
                  hiring.
                </td>
                <td>
                  Check current team and whether a specific product or design
                  requisition sits there.
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://www.linkedin.com/posts/mandydennison_director-social-impact-canada-intact-careers-activity-7414376021052854272-WI4A">
                    Mandy Dennison
                  </a>
                </td>
                <td>
                  Historical first-person invitation to a Montréal social-impact
                  leadership role on her team.
                </td>
                <td>
                  That vacancy is not in this snapshot; treat as organisational
                  context.
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://www.linkedin.com/posts/vanessaboyce_manager-digital-analytics-insights-job-activity-7301449576253661186-_VMO">
                    Vanessa Boyce / Marie-Pierre Leclerc
                  </a>
                </td>
                <td>
                  A historical team-hiring post for digital analytics and
                  insights.
                </td>
                <td>
                  Confirm present reporting line; no current requisition
                  assignment established.
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://ca.linkedin.com/in/marie-josee-marcotte-crha-a413bb9">
                    Marie-Josée Marcotte, CRHA
                  </a>
                </td>
                <td>
                  Public Intact talent-acquisition profile and historical campus
                  recruiting activity.
                </td>
                <td>
                  Ask for the relevant campus or business recruiter, rather than
                  assuming ownership.
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://ca.linkedin.com/in/maudlaurepilon/en">
                    Maud-Laure Pilon, MSc, CRHA
                  </a>
                </td>
                <td>
                  Public Intact talent-acquisition profile; finance-related
                  recruitment sharing.
                </td>
                <td>
                  Verify current finance / corporate assignment and exact
                  requisition.
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://ca.linkedin.com/in/genevievehrhebert/fr">
                    Geneviève Hébert, CRHA
                  </a>
                </td>
                <td>Public Intact HR / talent-acquisition background.</td>
                <td>
                  General routing lead only; no vacancy ownership established.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="research-small">
          Social posts establish what was advertised at the time, not a current
          opening. Relative timestamps were not converted into invented exact
          dates. A repost does not prove that the person sharing it manages the
          team. No private contact details were collected and no outreach was
          sent.
        </p>
        <h3>Reporting lines the descriptions actually reveal</h3>
        <p>
          <Role id="R155130" /> connects vendor work to the IT Business Office.{" "}
          <Role id="R155028" /> reports to a national learning and development
          manager. <Role id="R155432" /> describes IT portfolio governance,
          while <Role id="R155488" /> concerns AI-enabled claims experiences.
          These functional clues are stronger starting points than guessing from
          an executive’s title.
        </p>
        <p>
          <strong>Stale-lead check:</strong> Laurence Lafrenière’s recent public
          update indicates a departure to study, and Anders Laventure’s current
          profile identifies National Bank of Canada. Historical Intact
          recruiting posts therefore do not justify listing either as a current
          Intact recruiter.{" "}
          <a href="https://ca.linkedin.com/in/laurence-lafreni%C3%A8re-a9611928">
            Lafrenière profile
          </a>{" "}
          ·{" "}
          <a href="https://ca.linkedin.com/in/anderssourcerspecialist/en">
            Laventure profile
          </a>
          .
        </p>
      </section>
      <section id="process" className="research-section">
        <h2>Recruitment, interviews and culture</h2>
        <p>
          Intact publishes a five-stage process: find a role, apply, speak with
          the team, evaluation and offer. Depending on the role, evaluation can
          include assessments, recorded video or structured interviews; no
          single format is promised for every vacancy. The process page also
          describes background checks and accommodation through talent
          acquisition. It does not provide a universal hiring timeline.{" "}
          <a href="https://careers.intactfc.com/recruitment-process/page/1">
            Official recruitment process
          </a>
          .
        </p>
        <h3>Preparation by function</h3>
        <ul>
          <li>
            <strong>Claims / service:</strong> prepare examples of fact
            gathering, difficult conversations, judgement, accuracy and
            escalation. Check licence and language requirements first.
          </li>
          <li>
            <strong>Engineering / data:</strong> prepare evidence of systems or
            models shipped, operational reliability, testing, measurement and
            collaboration with business users.
          </li>
          <li>
            <strong>Product / design / business analysis:</strong> show problem
            definition, stakeholder decisions, prioritisation and outcomes;
            distinguish portfolio governance from application product
            management.
          </li>
          <li>
            <strong>Finance / actuarial / legal:</strong> establish required
            credentials and domain depth, then prepare examples demonstrating
            controls, reasoning and practical decisions.
          </li>
          <li>
            <strong>Leadership:</strong> prepare evidence of team management,
            delivery, coaching and trade-offs at the scale stated in the
            posting.
          </li>
        </ul>
        <p>
          These are research-based preparation suggestions, not verified Intact
          interview questions. Public employer material describes the desired
          culture; it cannot independently establish the experience of a
          particular team. Ask about workload, manager expectations, decision
          authority, development, office attendance and recent team changes
          during conversations.
        </p>
      </section>
      <section id="exceptions" className="research-section">
        <h2>Discrepancies and time-sensitive details</h2>
        <ul>
          <li>
            <Role id="R155541" /> combines paid licence training with wording
            that appears to require a licence. Clarify before treating it as
            licence-free entry.
          </li>
          <li>
            <Role id="R155565" /> is a winter 2027 internship with a September
            25, 2027 deadline in its text. The year is internally inconsistent;
            no corrected deadline has been invented.
          </li>
          <li>
            <Role id="R154991" /> uses a French director title alongside an
            English manager title. Confirm the actual grade and management
            scope.
          </li>
          <li>
            <Role id="R155615" /> describes two positions with different
            durations. <Role id="R155471" /> describes two manager openings and{" "}
            <Role id="R155186" /> three interns. Requisition counts are not
            headcounts.
          </li>
          <li>
            The 125 Montréal roles were selected from the complete
            203-requisition board crawl using explicit office locations, not
            search snippets or a broad Québec-region filter.
          </li>
        </ul>
      </section>
      <section id="actions" className="research-section">
        <h2>What this means for pursuing Intact</h2>
        <ol>
          <li>
            <strong>Choose the work family.</strong> Use the complete catalogue
            to separate regulated insurance, operations, technical, corporate
            and leadership routes.
          </li>
          <li>
            <strong>Resolve hard conditions.</strong> Office, language,
            credentials, eligibility, contract length and start date can
            determine feasibility before any résumé comparison.
          </li>
          <li>
            <strong>Keep an exact requisition list.</strong> Save IDs and verify
            availability on the employer’s site before investing in an
            application.
          </li>
          <li>
            <strong>Identify the owning team.</strong> Start from the department
            and reporting clues in the description. Public recruiting leads can
            help route a precise question; executive oversight does not identify
            the hiring manager.
          </li>
          <li>
            <strong>Prepare evidence for the mandate.</strong> Connect past work
            to the outcomes the function exists to deliver. Do this after
            deciding which work interests you.
          </li>
          <li>
            <strong>Refresh before acting.</strong> Recheck approaching
            deadlines and status, then compare a new snapshot against this
            baseline.{" "}
            <Link href="/target-companies/framework">
              Use the reusable framework
            </Link>
            .
          </li>
        </ol>
        <p>
          <strong>Overall assessment:</strong> Intact offers a much broader
          opportunity set than insurance sales alone. Technology and claims
          dominate this board, while finance, actuarial, project, legal and
          corporate work create additional routes. Montréal is a particularly
          substantial listed location. The most important unresolved question is
          which specific team and manager own each role—not whether the group
          has meaningful local hiring activity.
        </p>
      </section>
      <section id="sources" className="research-section research-sources">
        <h2>Evidence and limits</h2>
        <p>
          The vacancy dataset is a September 13, 2026 snapshot of the official
          Canada / Hong Kong careers board: 21 result pages and 203 descriptions
          collected as source material, narrowed to 125 Montréal-listed
          requisitions for this dossier. Every included role page links to its
          own source. Summaries are original paraphrases; the employer’s full
          descriptions remain on its site. Salary, bonus, locations and
          classification fields are extracted facts; experience and tool signals
          are comparison aids, with detailed qualification notes on selected
          roles.
        </p>
        <ul>
          <li>
            <a href="https://careers.intactfc.com/jobs">Official job board</a> —
            vacancy census and individual linked descriptions.
          </li>
          <li>
            <a href={`${corporate}/presentations/Intact_AnnualReport_2025.pdf`}>
              2025 annual report
            </a>{" "}
            — company scale and strategy.
          </li>
          <li>
            <a href="https://newsroom.intactfc.com/2026-07-28-Intact-Financial-Corporation-reports-Q2-2026-results">
              Q2 2026 release
            </a>{" "}
            — latest quarterly release reviewed.
          </li>
          <li>
            <a href={`${corporate}/corporate-governance/board-and-leadership`}>
              Current leadership directory
            </a>{" "}
            — executive positions.
          </li>
          <li>
            <a href={`${corporate}/about-us/intact-lab`}>Intact Lab</a> and{" "}
            <a href="https://careers.intactfc.com/tech-lab">
              technology careers
            </a>{" "}
            — published technology context.
          </li>
          <li>
            <a href="https://careers.intactfc.com/recruitment-process/page/1">
              Recruitment process
            </a>{" "}
            — employer-described stages.
          </li>
          <li>
            <a href={`${corporate}/about-us/brands`}>Group brands</a> and{" "}
            <a href="https://www.intactinsurance.co.uk/careers">UK careers</a> —
            starting points for separate subsidiary research.
          </li>
        </ul>
        <p>
          Not established: a complete worldwide vacancy census, current
          hiring-manager ownership, the number of seats behind every posting,
          actual offer amounts, team-level culture, universal hybrid rules or
          your commute. No automatic monitoring has been configured. Future
          research can extend the subsidiary coverage without confusing it with
          this board’s complete snapshot.
        </p>
        <p>
          <Link href="/target-companies/framework">
            Read the research framework and refresh protocol →
          </Link>
        </p>
      </section>
    </>
  );
}

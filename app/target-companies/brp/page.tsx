import type { Metadata } from "next";
import Link from "next/link";
import data from "@/lib/target-companies/brp-jobs.json";
import BRPRoleCatalogue from "@/components/BRPRoleCatalogue";
export const metadata: Metadata = {
  title: "BRP Montréal | Target Companies | Working Class Hero",
  description:
    "49 Montréal BRP requisitions, detailed requirements, René-Lévesque office, business analysis and hiring-team evidence. Researched September 19, 2026.",
};
const sources = {
  office: "https://www.brp.com/fr/notre-entreprise/bureaux.html",
  canada: "https://careers.brp.com/global/es/canada",
  management:
    "https://investisseurs.brp.com/investors/corporate-governance/management",
  transition:
    "https://investors.brp.com/news-releases/news-release-details/brp-announces-planned-financial-leadership-transition",
  results:
    "https://www.sec.gov/Archives/edgar/data/1748797/000119312526380894/d118875dex991.htm",
  financial:
    "https://ir.brp.com/news-releases/news-release-details/brp-announces-launch-brp-financial-services",
  recruiter:
    "https://ca.linkedin.com/in/genevi%C3%A8ve-beaus%C3%A9jour-849abb23",
  annual:
    "https://ir.brp.com/static-files/5f67c028-cc0b-43ca-884f-d0325bfbb3f8",
};
function Role({ id }: { id: string }) {
  const r = data.roles.find((r) => r.id === id);
  return r ? (
    <Link href={`/target-companies/brp/roles/${id}`}>
      {r.title} · {id}
    </Link>
  ) : null;
}
export default function BRPPage() {
  return (
    <>
      <p className="research-meta">
        TARGET COMPANY 02 · MONTRÉAL ONLY · SEPTEMBER 19, 2026
      </p>
      <h1>BRP: the René-Lévesque office</h1>
      <p>
        A company-first investigation of BRP’s Montréal work, requirements,
        teams and business direction. Intact remains your first-priority target.
        Your résumé has not been used to narrow these opportunities.
      </p>
      <div className="research-callout">
        <strong>Yes—the office you saw is on René-Lévesque.</strong>
        <p>
          BRP’s official directory confirms{" "}
          <b>
            1292 boulevard René-Lévesque Ouest, Suite 200, Montréal, QC H3G 0C4
          </b>
          . Its corporate headquarters are in Valcourt. This dossier includes
          Montréal postings only, even when a description also allows another
          office. <a href={sources.office}>Official office directory</a>.
        </p>
      </div>
      <div className="research-stats">
        {[
          [49, "Montréal requisitions"],
          [17, "IT category roles"],
          [11, "Finance category roles"],
          [2, "Published salary bands"],
        ].map(([n, label]) => (
          <div className="research-stat" key={label}>
            <strong>{n}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p className="research-meta">
        Dated snapshot: 47 English-listed and 49 French-listed Montréal
        requisitions; 49 unique IDs after reconciliation. Requisitions are not
        necessarily separate headcount. English and French versions of one ID
        count once.
      </p>
      <nav className="research-nav" aria-label="BRP dossier sections">
        {[
          ["company", "Company & business"],
          ["landscape", "Hiring landscape"],
          ["roles", "All 49 roles"],
          ["routes", "Entry routes"],
          ["pay", "Pay & work conditions"],
          ["people", "People & hiring teams"],
          ["process", "Recruitment & preparation"],
          ["exceptions", "Important distinctions"],
          ["conclusions", "Conclusions"],
          ["sources", "Sources & method"],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <section id="company" className="research-section">
        <h2>What BRP does—and why Montréal matters</h2>
        <p>
          BRP makes powersports products and powertrains: Ski-Doo and Lynx
          snowmobiles, Sea-Doo watercraft, Can-Am vehicles and Rotax engines,
          alongside parts, accessories and apparel. Its August 2026 corporate
          release reports FY2026 sales of approximately C$8.4 billion,
          distribution in more than 110 countries and nearly 17,000 employees as
          of January 31, 2026. These are group figures, not Montréal office
          headcount. <a href={sources.financial}>BRP company overview</a>.
        </p>
        <p>
          The Montréal office is a corporate and digital workplace. BRP’s
          location page identifies finance, legal, some HR and strategy teams,
          and digital marketing. Valcourt contains headquarters, product
          development and manufacturing; those jobs are not automatically local
          opportunities. The office page describes downtown transit access and
          collaborative workspaces, but is employer-authored and does not
          establish each team’s attendance policy.{" "}
          <a href={sources.canada}>BRP’s Canada locations</a>.
        </p>
        <h3>The business situation as of this research</h3>
        <p>
          For the quarter ended July 31, 2026, BRP reported revenue of C$2.237
          billion, up 18.5%, alongside a C$136.8 million net loss. Normalized
          EBITDA fell 34.9% to C$138.8 million. North American retail sales rose
          1%. The release attributes margin pressure partly to tariffs and
          supplier restructuring, while management raised full-year normalized
          EPS guidance. Revenue growth and cost pressure coexist; growth does
          not establish that every department is adding staff.{" "}
          <a href={sources.results}>September 3 FY2027 Q2 results</a>.
        </p>
        <p>
          <strong>Analysis:</strong> This makes forecasting, trade compliance,
          sourcing systems, operational reliability and investment
          prioritisation commercially important. The actual vacancy mix supports
          those themes, but it cannot tell us which roles are replacements or
          how secure an individual team’s budget is.
        </p>
        <h3>Three business priorities visible in the work</h3>
        <ul>
          <li>
            <b>Enterprise systems and logistics:</b> SAP delivery, EWM/TM,
            integrations and application-lifecycle roles support the flow of
            products, inventory and financial information.
          </li>
          <li>
            <b>Connected customer experience:</b> BRP GO!, mobile applications,
            over-the-air updates, dealer platforms and CRM connect a physical
            vehicle with digital ownership and service.
          </li>
          <li>
            <b>Commercial discipline:</b> finance, forecasting, customs and IT
            governance roles help turn global operations into controlled,
            measurable decisions.
          </li>
        </ul>
        <p>
          BRP also launched a US retail-financing programme in August 2026,
          powered by Octane. Its objectives include dealer support and a more
          integrated customer financing journey. This provides useful context
          for the Montréal <Role id="36329" />; it does not prove that this
          vacancy belongs to a newly created team.{" "}
          <a href={sources.financial}>Financial Services launch</a>.
        </p>
      </section>
      <section id="landscape" className="research-section">
        <h2>Where Montréal is hiring</h2>
        <div className="research-bars">
          {Object.entries(data.meta.categories).map(([name, n]) => (
            <div className="research-bar" key={name}>
              <span>{name}</span>
              <strong>{n}</strong>
              <meter
                min={0}
                max={17}
                value={n}
                aria-label={`${name}: ${n} requisitions`}
              />
            </div>
          ))}
        </div>
        <p className="research-meta">
          Official categories, with French “Finances” normalised to “Finance.”
          Category labels can be surprising: some connectivity software roles
          sit under Communications & Marketing.
        </p>
        <div className="research-grid">
          <article>
            <h3>SAP, cloud and enterprise technology</h3>
            <p>
              The largest official category has 17 roles. Across categories,
              there is a substantial SAP ecosystem: development, functional
              analysis, integration, finance-system partnership and operational
              leadership. An SAP keyword alone is insufficient; EWM/TM
              logistics, GTS customs, ABAP integration and finance processes are
              different specialisms.
            </p>
            <p>
              <Role id="36393" /> provides a distinct JAGGAER procurement route,
              while <Role id="36350" /> concerns portfolio-management software.
            </p>
          </article>
          <article>
            <h3>Finance and commercial analysis</h3>
            <p>
              Eleven roles sit in Finance after category normalisation. They
              include corporate FP&A, IT finance, accounts payable, ecommerce
              modelling, tax and SAP transformation. CPA is mandatory for some
              roles and an asset for others; the individual requirement pages
              preserve the distinction.
            </p>
            <p>
              <Role id="33946" /> combines process improvement with finance and
              analytics. <Role id="35177" /> is tied to ecommerce planning.
            </p>
          </article>
          <article>
            <h3>Digital products and marketing</h3>
            <p>
              The nine Communications & Marketing postings include mobile
              development and connectivity leadership as well as social, CRM and
              content-platform work. Separate customer-facing product ownership
              from data-product ownership and digital-asset platform ownership.
            </p>
            <p>
              <Role id="35432" /> has a three-year product-management threshold;{" "}
              <Role id="36094" /> requires AEM Assets experience.
            </p>
          </article>
          <article>
            <h3>Operations, people and compliance</h3>
            <p>
              Five Operations & Supply Chain roles, three HR roles, three
              Legal-category roles and one Other-category role complete the
              inventory. Legal includes audit-related work, so it does not mean
              that every opening requires bar admission.
            </p>
            <p>
              <Role id="34682" /> concerns customs controls; <Role id="36177" />{" "}
              audits connected-vehicle cybersecurity. These differ materially
              from <Role id="36074" />, which supports IT general controls.
            </p>
          </article>
        </div>
      </section>
      <section id="roles" className="research-section">
        <h2>All 49 Montréal roles</h2>
        <p>
          Every role has an original responsibility summary, a curated
          requirement breakdown, reporting clues, work conditions and links to
          full employer descriptions. Search titles, IDs, tools or requirements.
          This is the September 19 snapshot; follow the official application
          page to confirm availability.
        </p>
        <BRPRoleCatalogue roles={data.roles} />
      </section>
      <section id="routes" className="research-section">
        <h2>Entry routes: where the gates differ</h2>
        <div className="research-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Route</th>
                <th>Examples</th>
                <th>What matters</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lower stated experience threshold</td>
                <td>
                  <Role id="36036" />
                  <br />
                  <Role id="34682" />
                  <br />
                  <Role id="35760" />
                  <br />
                  <Role id="36423" />
                </td>
                <td>
                  GTS partnership: 1–3 years, but specific SAP knowledge and a
                  12-month term. Customs and packaging: 2+ years. HR
                  coordination: 2–4 years. These are not qualification-free
                  roles.
                </td>
              </tr>
              <tr>
                <td>Professional route without a numerical minimum</td>
                <td>
                  <Role id="36074" />
                </td>
                <td>
                  Related education, Excel and English are specified; audit
                  experience and CISA/CPA progress are assets. No numerical
                  minimum is not a promise of entry-level selection.
                </td>
              </tr>
              <tr>
                <td>Established specialist</td>
                <td>
                  <Role id="35432" />
                  <br />
                  <Role id="36480" />
                  <br />
                  <Role id="36345" />
                </td>
                <td>
                  Three or more years of directly relevant work. Corporate
                  finance requires CPA; IT finance lists Power BI and SAP as
                  assets.
                </td>
              </tr>
              <tr>
                <td>Platform expert</td>
                <td>
                  <Role id="35501" />
                  <br />
                  <Role id="34509" />
                  <br />
                  <Role id="34588" />
                </td>
                <td>
                  Deep system knowledge and substantial delivery experience. AI
                  architecture asks for ten years in IT; cloud and SAP roles
                  require hands-on operational expertise.
                </td>
              </tr>
              <tr>
                <td>Team / programme leadership</td>
                <td>
                  <Role id="35957" />
                  <br />
                  <Role id="36108" />
                  <br />
                  <Role id="36538" />
                </td>
                <td>
                  Evidence of people or complex programme leadership. The
                  connectivity director leads 40+ experts; recruitment
                  management asks for 8–10 years; PLM management asks for 10+.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          No internship or graduate-development programme was identified among
          these 49 Montréal requisitions. Broader group campus programmes or
          past summer posts should not be presented as current Montréal
          openings.
        </p>
        <p>
          <strong>Company-first conclusion:</strong> There are several routes
          into BRP, but this snapshot is weighted toward experienced
          professionals. The most useful first distinction is the kind of work:
          finance, systems, product, marketing, people or compliance. Candidate
          matching can come later if requested.
        </p>
      </section>
      <section id="pay" className="research-section">
        <h2>Pay, hours, hybrid work and language</h2>
        <p>
          Two French-board-only requisitions publish annual salary bands. The
          other 47 captured descriptions do not provide a numerical base range.
          No bonus target percentage was found. Do not apply these two ranges to
          other BRP jobs or use executive compensation as a proxy.
        </p>
        <div className="research-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Published annual base, CAD</th>
                <th>Explicit body conditions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Role id="35771" />
                </td>
                <td>$89,800–$146,000</td>
                <td>
                  Permanent full-time, 37.5 hours, daytime; start as soon as
                  possible.
                </td>
              </tr>
              <tr>
                <td>
                  <Role id="35672" />
                </td>
                <td>$89,840–$145,990</td>
                <td>
                  Permanent full-time, 37.5 hours, daytime; degree and 8+ years
                  experience.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The English descriptions carry a 40-hour structured field. The two
          French-only roles explicitly state 37.5 hours in their body text; that
          explicit term is shown on their pages and should be confirmed in an
          offer. Full-time metadata elsewhere does not establish permanence.
        </p>
        <p>
          Forty-five English descriptions carry a hybrid tag, without a
          universal weekly office cadence. <Role id="36329" /> explicitly
          permits hybrid or remote options. <Role id="35969" /> and{" "}
          <Role id="36192" /> specify irregular hours and 24/7 operational
          coverage; <Role id="35094" /> warns of irregular hours. Proximity to
          the office does not resolve those schedule requirements.
        </p>
        <h3>Benefits and conditions to verify</h3>
        <p>
          Many descriptions advertise a results-based annual bonus, pension and
          savings arrangements, paid leave, healthcare, educational resources,
          product discounts and seasonal schedule provisions. Those are
          employer-stated benefits, not verified individual entitlements.
          Confirm employee class, waiting periods, coverage, bonus eligibility
          and the applicable office policy. <Role id="35969" /> is one source
          for this common benefits language.
        </p>
        <h3>French and English are role-specific</h3>
        <p>
          Many roles explicitly require both languages because they serve global
          teams. There are meaningful exceptions: <Role id="36447" /> requires
          excellent English and treats French as a strong asset;{" "}
          <Role id="36233" /> requires English with French an asset;{" "}
          <Role id="36094" /> describes both as preferred. The mobile roles use
          “French or English” wording with additional global-communication
          context. Check the exact requisition rather than assuming one rule for
          all Montréal hiring.
        </p>
      </section>
      <section id="people" className="research-section">
        <h2>People and hiring-team evidence</h2>
        <div className="research-callout">
          <strong>
            One exact requisition-to-team association was established.
          </strong>
          <p>
            A public recruiter post names Xiao Ai Cai’s team and links to
            Instructional Designer <Role id="36447" />. That identifies the
            hiring team; the person with final hiring authority is not
            independently confirmed. Other leads below have weaker or historical
            links and are labelled accordingly.
          </p>
        </div>
        <h3>Current organisational leadership</h3>
        <p>
          Use the <a href={sources.management}>official management directory</a>{" "}
          for organisational context, not as a list of people who personally
          recruit every role.
        </p>
        <div className="research-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Person</th>
                <th>Published role / relevance</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Denis Le Vot",
                  "President and CEO; in role since February 1, 2026.",
                ],
                [
                  "Stéphane Bilodeau",
                  "Chief Information Officer; enterprise IT.",
                ],
                ["Thomas Uhr", "Chief Technology Officer; product technology."],
                [
                  "Sébastien Martel",
                  "Current Chief Financial Officer on September 19.",
                ],
                [
                  "Minh Thanh Tran",
                  "EVP, Global Corporate and Product Strategy; incoming CFO.",
                ],
                [
                  "Josée Perreault",
                  "Chief Marketing Officer; omnichannel remit.",
                ],
                ["Anne Le Breton", "EVP, People and Culture."],
                [
                  "Martin Langelier",
                  "Chief Legal Officer and Corporate Services.",
                ],
                ["Denys Lapointe", "Chief Design Officer."],
              ].map(([name, title]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>Scheduled transition:</strong> Minh Thanh Tran becomes CFO on
          October 1, 2026. Sébastien Martel is to move into an executive-advisor
          role until retirement in April 2027. Do not describe the incoming
          appointment as already effective.{" "}
          <a href={sources.transition}>September 3 succession announcement</a>.
        </p>
        <h3>Public recruiting and team leads</h3>
        <div className="research-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Person</th>
                <th>Evidence and relevance</th>
                <th>Confidence / limitation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <a href={sources.recruiter}>Geneviève Beauséjour</a>
                </td>
                <td>
                  BRP Senior Talent Acquisition Advisor. Public hiring material
                  links to JAGGAER requisition 36393 and instructional design
                  36447.
                </td>
                <td>
                  Verified recruiting lead and exact posting links; not
                  automatically the hiring manager.
                </td>
              </tr>
              <tr>
                <td>Xiao Ai Cai</td>
                <td>
                  <a href={sources.recruiter}>Recruiter’s post</a> names this
                  team; its{" "}
                  <a href="https://lnkd.in/dYrCS95f">linked vacancy</a> resolves
                  to 36447.
                </td>
                <td>
                  Exact requisition-to-team association. Final decision-maker
                  unconfirmed.
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://ca.linkedin.com/in/dave-rainville-504a7816">
                    Dave Rainville
                  </a>
                </td>
                <td>
                  BRP profile and first-person ERP team hiring; a recent PLM
                  team-hiring post is surfaced in{" "}
                  <a href={sources.recruiter}>public activity</a>.
                </td>
                <td>
                  Relevant programme-delivery lead. No exact-ID ownership
                  verified for 36538.
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://ca.linkedin.com/in/merabet">
                    Leila Merabet, MBA, CPIM
                  </a>
                </td>
                <td>
                  Public demand-planning team hiring. A newer recruiter link
                  points to 35876, while the current Montréal catalogue contains
                  36434.
                </td>
                <td>
                  Relevant team lead; different requisition, so current-role
                  ownership remains unconfirmed.
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://ca.linkedin.com/in/jasminboudreau">
                    Jasmin Boudreau
                  </a>
                </td>
                <td>
                  Profile identifies Global PA&A Packaging Strategy management.
                  Recruiter hiring link points to 36355; the Montréal entry here
                  is 36423.
                </td>
                <td>
                  Related packaging leader; do not conflate those requisitions.
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://ca.linkedin.com/in/hazime">
                    Ibtissam Hazime
                  </a>
                </td>
                <td>
                  Public BRP affiliation and talent-acquisition background;
                  visible finance and IT recruitment activity.
                </td>
                <td>
                  Recruiting/routing lead; assigned current requisitions not
                  established.
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://ca.linkedin.com/in/joseedaoust">
                    Josée Daoust
                  </a>
                </td>
                <td>First-person global talent-management hiring posts.</td>
                <td>
                  Historical HR-team context; those advertised roles are not
                  established as current catalogue openings.
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://ca.linkedin.com/in/jessicamalbeuf">
                    Jessica Malbeuf, CRHA
                  </a>
                </td>
                <td>
                  First-person talent-partner hiring for multiple Québec
                  offices.
                </td>
                <td>
                  Historical team evidence, not ownership of current Talent
                  Acquisition Manager 36108.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="research-small">
          Public professional evidence was accessed September 19. Relative
          social timestamps are not converted into invented dates. A like or
          repost is not proof of management responsibility. No outreach was
          sent.
        </p>
        <h3>Reporting clues directly in current descriptions</h3>
        <ul>
          <li>
            <Role id="35570" /> → Director, Global Strategic Planning,
            BRP-Technology.
          </li>
          <li>
            <Role id="35501" /> → Manager of Solution Architecture.
          </li>
          <li>
            <Role id="36480" /> → Manager, Finance, Corporate FP&A.
          </li>
          <li>
            <Role id="35432" /> → Connectivity Team Leader.
          </li>
          <li>
            <Role id="36400" /> → Global CRM Marketing Automation Manager.
          </li>
          <li>
            <Role id="35760" /> → HR Service Manager, Global Services.
          </li>
          <li>
            <Role id="36518" /> → PA&A Marketing Team Lead.
          </li>
        </ul>
        <p>
          These functional reporting lines are established by job text. The
          corresponding personal names are not inferred from executive titles.
        </p>
      </section>
      <section id="process" className="research-section">
        <h2>Recruitment and preparation</h2>
        <p>
          Use the external BRP careers pages linked from each role. An indexed
          Taleo search page explicitly says it is for internal candidates and
          directs external applicants to the public careers site; its count is
          not combined with this external census. No universal interview
          sequence, assessment type or hiring timeline was verified, so the
          suggestions below are preparation advice rather than a claim about
          BRP’s interview format.{" "}
          <a href="https://lde.tbe.taleo.net/lde01/ats/careers/v2/jobSearch?cws=52&org=STG_BRP2">
            Internal-site notice
          </a>
          .
        </p>
        <ul>
          <li>
            <b>SAP and platforms:</b> prepare a concrete configuration or
            integration example, including requirements, failure modes, rollout
            and support. Identify the exact modules in the role.
          </li>
          <li>
            <b>Finance and analytics:</b> show how a model, forecast or control
            changed a business decision. Separate accounting credentials from
            analytical tools.
          </li>
          <li>
            <b>Product and marketing:</b> bring evidence of prioritisation,
            customer learning, measurable outcomes and cross-functional
            delivery. DAM, data products and connected-vehicle products need
            different examples.
          </li>
          <li>
            <b>Operations and governance:</b> explain an incident, compliance
            finding or programme risk and how you coordinated resolution.
          </li>
          <li>
            <b>Leadership:</b> demonstrate the scale of teams or programmes you
            have led and how you handled trade-offs, coaching and difficult
            delivery periods.
          </li>
        </ul>
        <p>
          Ask about the manager, first-90-day outcomes, office schedule, travel,
          compensation, vacancy type and current programme priorities. Employer
          culture language describes aspiration; team workload and management
          quality require direct conversation. The new leadership, finance
          transition and active transformation programmes are useful topics to
          understand, not evidence that a team is necessarily unstable.
        </p>
      </section>
      <section id="exceptions" className="research-section">
        <h2>Distinctions that prevent bad assumptions</h2>
        <ol>
          <li>
            <b>English-only searching misses roles.</b> French-only requisitions
            35771 and 35672 supply two additional opportunities and the only
            captured salary bands.
          </li>
          <li>
            <b>Similar titles can have different requirements.</b> Mobile roles
            35622 and 35672 are separate IDs; the latter explicitly adds a
            degree, eight years, a salary range and 37.5 hours.
          </li>
          <li>
            <b>Duplicate-looking SAP postings remain separate.</b> Integration
            developer IDs 35604 and 36000 have very similar text. EWM/TM roles
            32459, 34588 and 36354 also overlap. Retain them until BRP confirms
            whether hiring overlaps.
          </li>
          <li>
            <b>Category is not the team mandate.</b> Product Owner 36261 is a
            Legal/GTS data role. Connectivity software roles can appear in
            Marketing.
          </li>
          <li>
            <b>Learning language does not waive experience.</b> SAP/Finance
            Business Partner 36449 offers development toward systems expertise,
            but asks for CPA and five years.
          </li>
          <li>
            <b>Job-board dates differ.</b> Use the employer’s displayed posting
            date and our check date; aggregator refresh dates do not establish
            when a role first opened.
          </li>
          <li>
            <b>Relevance-sorted pagination can duplicate or omit results.</b>{" "}
            The initial 25-page crawl yielded 238 unique IDs against a displayed
            250 total. A single official search response reconciled all 250
            before the Montréal subset was finalised.
          </li>
          <li>
            <b>Office, territory and attendance are different.</b> Montréal
            eligibility does not guarantee every workday is downtown,
            particularly for operational support or global programme work.
          </li>
        </ol>
      </section>
      <section id="conclusions" className="research-section">
        <h2>What this means for BRP as a target</h2>
        <p>
          BRP offers a substantial downtown corporate and technology opportunity
          set: 49 distinct Montréal requisitions across eight raw category
          labels, normalised to seven here. Its strongest concentration is
          enterprise technology and finance, with meaningful customer-product,
          CRM, marketing and operational work alongside it. Most roles ask for
          relevant professional experience; the smaller number with lower
          thresholds still have clear technical or educational gates.
        </p>
        <p>
          The most useful next step is to explore by work family, then check the
          exact requirements and reporting team. The René-Lévesque office is
          confirmed, but office attendance and compensation need role-level
          confirmation. The broader company’s growth, tariff exposure and
          transformation programme should inform interview questions without
          substituting for evidence about a particular team.
        </p>
        <p>
          <Link href="/target-companies/framework">
            Reusable research framework
          </Link>{" "}
          ·{" "}
          <Link href="/target-companies/intact">
            Intact remains Target Company 01
          </Link>
        </p>
      </section>
      <section id="sources" className="research-section research-sources">
        <h2>Sources, coverage and research date</h2>
        <p>
          Research checked September 19, 2026. The official English external
          search returned 250 jobs; the French external search returned 145. All
          descriptions in both sets were fetched and screened for Montréal, then
          deduplicated by requisition ID. The final set contains 49 Montréal
          IDs: 47 available in English and 49 in French. Other-city-only
          positions and internal-candidate postings are excluded. Counts
          represent published requisitions, not verified seats.
        </p>
        <p>
          Every included role has a source link and original paraphrase. The
          English descriptions were used for the 47 bilingual-listed roles;
          French-only descriptions were translated and summarised for the
          remaining two. French versions were checked for coverage and salary
          disclosure, not certified as sentence-for-sentence equivalents. No
          individual offer, fixed hybrid cadence, complete interview process or
          hiring outcome has been verified. No recurring monitoring or outreach
          is configured.
        </p>
        <ul>
          <li>
            <a href="https://careers.brp.com/global/en/search-results">
              Official English search
            </a>{" "}
            and{" "}
            <a href="https://careers.brp.com/ca/fr/search-results">
              French search
            </a>
            .
          </li>
          <li>
            <a href={sources.office}>Official office directory</a> and{" "}
            <a href={sources.canada}>Canada location overview</a>.
          </li>
          <li>
            <a href={sources.results}>FY2027 Q2 release filed with the SEC</a>.
          </li>
          <li>
            <a href={sources.financial}>
              Financial Services launch and company overview
            </a>
            .
          </li>
          <li>
            <a href={sources.management}>Management directory</a> and{" "}
            <a href={sources.transition}>CFO transition announcement</a>.
          </li>
          <li>
            <a href={sources.annual}>FY2026 annual report</a> — further company
            reading; quarterly context above uses the newer release.
          </li>
          <li>
            Public people sources are linked beside the claims they support.
          </li>
        </ul>
      </section>
    </>
  );
}

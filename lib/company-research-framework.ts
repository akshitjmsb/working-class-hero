// Shared research method for agent tools and the web reference page.
// Consumers must preserve dated evidence, analysis, and unknowns separately.
export const COMPANY_TRANSACTION_LEAD = {
  title: "Start with the simplest transaction",
  instruction: "Lead every company analysis with who pays whom, what is exchanged, why the customer pays, and how the company earns revenue. Use plain language and one concrete example; label invented numbers as illustrative. Separate revenue from profit: profit remains after relevant costs, and revenue alone does not establish profitability. Label sourced facts, inference and unknowns, with source links and check dates. For multi-business groups, distinguish materially different transactions and identify the entity earning each revenue stream. For mortgage groups such as nesto, distinguish lending, origination, servicing and technology where supported; do not assume all borrower interest belongs to the group. Identify the lender/funder, intermediary and recipient of each payment, or state that they are unknown. This lead applies to voice briefs, reports and interfaces before deeper company or hiring analysis; it does not add a research phase or silently filter by résumé.",
  fields: ["Who pays whom", "What is exchanged", "Why the customer pays", "How the company earns revenue"],
  example: "Illustrative example: a customer pays a café $5 for a coffee because they want a prepared drink. The café earns $5 in sales revenue; its profit is what remains after ingredients, wages, rent and other relevant costs. The $5 is not profit.",
} as const;

export const COMPANY_RESEARCH_PHASES: readonly (readonly [string, string, string])[] = [
  [
    "1. Define the company and scope",
    "Confirm the legal group, brands, subsidiaries, countries and official domains. Record the user’s geographic scope first: this search is Montréal only. Include multi-office roles only when Montréal is explicitly available; nearby cities are not substitutes. Do not silently filter by résumé. State which hiring boards are in scope and which remain outside it. Use a dated snapshot rather than implying continuous freshness.",
    "Scope statement; subsidiary / hiring-system map; check date.",
  ],
  [
    "2. Establish the business context",
    "Read the latest annual report, most recent relevant results, current leadership pages and business-unit material. Start the explanation with the simplest transaction: who pays whom, what is exchanged, why the customer pays and how the company earns revenue. Give one concrete example, separate revenue from profit and distinguish materially different group businesses and payment recipients. Then explain what the company sells, who its customers are, where it operates and what functions support its economics. Distinguish management’s claims from independent evidence and your interpretation.",
    "Transaction-first company brief; concrete example; revenue versus profit; current financial period; strategy-to-work analysis; source links.",
  ],
  [
    "3. Enumerate every opening",
    "Start at official career boards, enumerate pagination or supported public search data, capture the reported total and deduplicate by requisition ID within each hiring system. Record all locations as options on one posting. Follow each canonical description. A search-engine result list is discovery, not a census.",
    "Complete raw manifest; observed and reported counts; gaps and failed fetches.",
  ],
  [
    "4. Read and normalise descriptions",
    "For every role record title, ID, business unit, category, location, employment type, work arrangement, posting date, deadline, start date, salary, bonus, language, responsibilities, requirements and application URL. Preserve required versus preferred, alternatives and location-specific rules. Summarise the work in original language and link to the full source.",
    "One addressable role page per requisition; structured dataset; requirement notes.",
  ],
  [
    "5. Map routes and constraints",
    "Separate student programmes, paid training, early professional, specialist, management and fixed-term routes. Compare actual mandates rather than titles alone. Identify licence, credential, student-status, language, travel, shift and office gates. Do not equate full-time with permanent or a hybrid tag with a fixed attendance schedule.",
    "Role-family analysis; entry-route map; compensation and office comparisons.",
  ],
  [
    "6. Research people and reporting lines",
    "Start with current official leadership biographies, then public professional profiles and first-person hiring posts. Search exact requisitions, team names and reporting phrases. Verify current employer and distinguish original posts from reposts. Do not infer that a recruiter or executive owns a vacancy.",
    "Leadership map; public recruiting leads; evidence class; current-owner unknowns.",
  ],
  [
    "7. Explain recruitment and culture",
    "Use the employer’s published process for confirmed steps. Treat interview preparation as advice unless specific questions are independently evidenced. Separate corporate values and benefits advertising from team experience. If reviewing employee commentary, record date, location, role and sampling limitations.",
    "Process brief; questions for interviews; verified benefits versus conditions to confirm.",
  ],
  [
    "8. Resolve contradictions",
    "Compare structured fields with body text and current pages with older results. Preserve conflicting dates, locations, titles and eligibility requirements. Never silently repair a date or assume a removed page proves the position was filled. Make time-sensitive concerns visible on the role itself.",
    "Exception register; confidence notes; specific clarification questions.",
  ],
  [
    "9. Publish and verify",
    "Reconcile counts, check all IDs and links, verify source coverage, inspect the role pages and confirm filters work across cities and functions. Keep the source date prominent. Distinguish factual fields, automated signals and editorial analysis. Do not publish copied full descriptions or private contact details.",
    "Target-company page; complete catalogue; sources; quality-check record.",
  ],
  [
    "10. Refresh and compare",
    "Run a new census at the next research session or immediately before acting. Compare stable IDs and normalised fields. Classify new, still listed, materially changed and no longer observed; retry unavailable descriptions before drawing conclusions. Keep the prior dated snapshot for comparison.",
    "Change log; renewed status checks; preserved provenance; updated conclusions.",
  ],
];

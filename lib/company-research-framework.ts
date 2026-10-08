// Shared research method for agent tools and the web reference page.
// Consumers must preserve dated evidence, analysis, and unknowns separately.
export const COMPANY_RESEARCH_PHASES: readonly (readonly [string, string, string])[] = [
  [
    "1. Define the company and scope",
    "Confirm the legal group, brands, subsidiaries, countries and official domains. Record the user’s geographic scope first: this search is Montréal only. Include multi-office roles only when Montréal is explicitly available; nearby cities are not substitutes. Do not silently filter by résumé. State which hiring boards are in scope and which remain outside it. Use a dated snapshot rather than implying continuous freshness.",
    "Scope statement; subsidiary / hiring-system map; check date.",
  ],
  [
    "2. Establish the business context",
    "Read the latest annual report, most recent relevant results, current leadership pages and business-unit material. Explain what the company sells, who its customers are, where it operates and what functions support its economics. Distinguish management’s claims from independent evidence and your interpretation.",
    "Company brief; current financial period; strategy-to-work analysis; source links.",
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

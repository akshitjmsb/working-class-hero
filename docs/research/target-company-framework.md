# Target-company research framework
Version 2 — 2026-10-09. First application: Intact Financial Corporation.

## Purpose
Understand an employer and its actual hiring landscape before candidate matching. Preserve explicit user constraints: Intact is priority 1 because of proximity; do not use the résumé to filter. No outreach is authorised by a research request.

## Required leading explanation
Begin every company analysis with the simplest underlying transaction: who pays whom, what is exchanged, why the customer pays, and how the company earns revenue. Give one concrete example in plain language, marking hypothetical amounts as illustrative. Separate revenue from profit after relevant costs. Label sourced facts, inference and unknowns with dates and links. For multi-business groups, distinguish materially different transactions and their revenue recipients; do not assume all borrower interest belongs to a mortgage group such as nesto. This opening applies to voice, report, interface and structured JSON outputs and preserves all ten research phases and the no-silent-résumé-filtering rule.

## Repeatable workflow
1. Establish legal entity, brands, official domains, geography, board coverage and snapshot date. The user’s search scope is Montréal only: include multi-office postings only when Montréal is explicit, and exclude neighbouring cities alone. Apply this geographic scope to counts, examples, filters and role routes; retain broader raw collection only as provenance.
2. Read latest annual report, relevant interim results, current leadership and operating-unit sources. Keep business facts distinct from interpretation.
3. Enumerate official board pagination. Record reported totals; deduplicate on hiring-system + requisition ID. Multi-office postings count once. Count requisitions, not seats.
4. Fetch each full official description. Preserve raw source privately for audit; record fetch time and canonical source URL. Do not publish wholesale copyrighted descriptions.
5. Write an original per-role responsibility summary. Extract structured fields and capture required, preferred, equivalent and conditional requirements separately. Identify missing fields explicitly.
6. Analyse functions, routes, credentials, language, work model, schedule, pay, contracts and location. Do not infer permanent from full-time or attendance frequency from hybrid.
7. Map people from current official biographies and public professional sources. Verify current employer and differentiate exact requisition ownership, historical team hiring, recruiting leads and executive oversight. A repost is not proof of team ownership.
8. Record contradictions in dates, titles, locations and qualification wording. Do not silently resolve them. Link the discrepancy to the role page.
9. Publish overview, every role, people map, sources, confidence and limitations. Validate data, route rendering, navigation and interactive filters.
10. Refresh before acting. Preserve baseline and report new IDs, still-listed IDs, material changes and no-longer-observed IDs. Retry errors; disappearance does not establish filled status.

## Record schema
- Identity: company, brand, hiringSystem, requisitionId, title, canonicalUrl, applicationUrl.
- Provenance: checkedAt (UTC), sourceType, sourceDate, observedStatus, rawSourceReference, extractionNotes.
- Organisation: category, department, reportingLine, namedManager, managerEvidenceClass, managerSource.
- Location: array of address/city/province/country; workModel; territory; travel; schedule.
- Employment: type, term, hours, startDate, closingDate, closingTimezone, eligibility.
- Compensation: currency, basis, min, max, targetBonus, conditions. Null is unknown, not zero.
- Work: originalSummary, deliverables, stakeholders, businessMandate.
- Requirements: required[], preferred[], alternatives[], experience, education, licences, languages, tools.
- Exceptions: contradictions[], unknowns[], followUpQuestions[].

## People evidence classes
Confirmed requisition owner requires a current source explicitly linking the named person to that requisition (or direct confirmation). Team-hiring evidence supports only a potential team lead unless the exact opening is established. Recruiter affiliation supports routing, not assigned openings. Executive biographies support organisational remit. Historical or departed people are excluded from current-contact recommendations.

## Source hierarchy and claim controls
Prefer official live JDs for conditions; official current biographies for titles; filings/results for company figures. Search snippets are discovery only. Record dates of both publication and access. Label corporate claims, public professional evidence and editorial inferences. Do not infer facts from missing text. Keep per-source quotations and paraphrases within copyright limits; link complete external descriptions.

## Refresh rules
Use stable IDs rather than titles. Hash normalised substantive fields to identify changes; exclude tracking parameters and boilerplate. Changes to deadline, location, pay, required credentials, contract type and manager ownership deserve prominent flags. Historical snapshots should remain dated, never presented as live. Do not configure recurring monitoring without a user request.

## Completion checks
Reconcile counts; ensure unique IDs and valid locations/URLs; check all summaries; audit numerical extraction and conditional wording; list unvisited systems; check stale professional profiles; verify representative and edge-case routes; run repository-required checks; verify deployed pages and navigation. Report limitations rather than manufacturing completeness.

## Published structure
/target-companies → company index
/target-companies/{company} → full dossier and searchable census
/target-companies/{company}/roles/{id} → per-role original summary and official source
/target-companies/framework → user-facing reusable method

## BRP refinements — 2026-09-19
Validate language from the returned locale and titles, not the requested URL or a language parameter alone. Enumerate each official language board and reconcile stable IDs; translations can have additional postings and salary fields. Relevance-sorted pagination may change order across requests: reconcile against a complete official response where available. Resolve recruiter short links to actual requisition IDs before claiming current-role ownership. Prefer explicit description-body hours over generic metadata, while preserving the discrepancy. Deduplicate identical IDs across languages, not different IDs with similar titles. Record future-effective leadership changes separately from current appointments.

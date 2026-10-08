// Read-only system entry point: stored company evidence + the shared framework.
// Run: node --import tsx scripts/company-intelligence.ts montreal "Intact"
import { bundledCompanies } from '../lib/companies';
import { isCityId } from '../lib/cities';
import { COMPANY_RESEARCH_PHASES } from '../lib/company-research-framework';

const [city, ...words] = process.argv.slice(2);
const query = words.join(' ').trim();
if (!isCityId(city) || !query) {
  console.error('Provide a supported city and company name.');
  process.exit(1);
}
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const term = normalize(query);
const all = bundledCompanies(city);
const exact = all.filter(c => normalize(c.id) === term || normalize(c.name) === term);
const matches = exact.length ? exact : all.filter(c => normalize(c.name).includes(term));
console.log(JSON.stringify({
  system: 'Working Class Hero',
  city,
  query,
  identityStatus: matches.length === 1 ? 'single_stored_match' : matches.length ? 'ambiguous' : 'not_in_stored_dataset',
  evidenceStatus: 'stored_snapshot_not_live_verified',
  instruction: 'Confirm company identity and scope. Recheck time-sensitive claims against current sources. Keep observed facts, analysis and unknowns separate. Apply the framework to the requested city; historical Montréal examples do not override that scope.',
  companies: matches,
  framework: COMPANY_RESEARCH_PHASES.map(([phase, method, output]) => ({ phase, method, output })),
}, null, 2));

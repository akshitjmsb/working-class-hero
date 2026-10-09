import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import FrameworkPage from '../app/target-companies/framework/page';
import { systemTools } from '../lib/intelligence/tools';
import { COMPANY_TRANSACTION_LEAD } from '../lib/company-research-framework';

test('agent framework and rendered playbook lead with the same transaction contract while retaining ten phases', async () => {
  const tool = systemTools.find((entry) => entry.name === 'get_research_framework')!;
  const result = await tool.execute({}) as {
    leadingElement: typeof COMPANY_TRANSACTION_LEAD;
    instructions: string;
    phases: { phase: string; method: string }[];
  };
  assert.deepEqual(result.leadingElement, COMPANY_TRANSACTION_LEAD);
  assert.ok(result.instructions.includes(result.leadingElement.instruction));
  assert.equal(result.phases.length, 10);
  assert.match(result.phases[0].method, /Do not silently filter by résumé/);
  assert.match(result.phases[1].method, /revenue from profit/);
  const html = renderToStaticMarkup(createElement(FrameworkPage));
  assert.ok(html.indexOf(result.leadingElement.title) < html.indexOf(result.phases[0].phase));
  for (const field of result.leadingElement.fields) assert.ok(html.includes(field));
  assert.match(html, /The \$5 is not profit/);
  assert.match(html, /do not assume all borrower interest belongs to the group/);
});

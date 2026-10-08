import { createHash } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

export class SystemError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

function database() {
  if (!process.env.DATABASE_URL) throw new SystemError('System memory is not configured.', 503);
  return neon(process.env.DATABASE_URL);
}

export const SYSTEM_DDL = [
  `CREATE TABLE IF NOT EXISTS wch_investigations (
    id text PRIMARY KEY, company_id text NOT NULL, company_name text NOT NULL,
    city text NOT NULL, initial_goal text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS wch_events (
    sequence bigserial PRIMARY KEY, request_id text NOT NULL UNIQUE,
    investigation_id text NOT NULL REFERENCES wch_investigations(id),
    kind text NOT NULL CHECK (kind IN ('discussion','interest','decision','question','evidence','output')),
    payload jsonb NOT NULL, fingerprint text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS wch_events_investigation_sequence ON wch_events(investigation_id, sequence DESC)`,
  `CREATE INDEX IF NOT EXISTS wch_events_kind_sequence ON wch_events(kind, sequence DESC)`,
];

export async function migrateSystem() {
  const sql = database();
  await sql.transaction(SYSTEM_DDL.map(statement => sql.query(statement)));
}

export async function beginInvestigation(companyId: string, companyName: string, city: string, goal: string) {
  const sql = database();
  const id = `${city}:${companyId}`;
  await sql`INSERT INTO wch_investigations(id, company_id, company_name, city, initial_goal)
    VALUES (${id}, ${companyId}, ${companyName}, ${city}, ${goal}) ON CONFLICT (id) DO NOTHING`;
  const [row] = await sql`SELECT * FROM wch_investigations WHERE id = ${id}`;
  return row;
}

export async function appendEvent(investigationId: string, requestId: string, kind: string, payload: unknown) {
  const sql = database();
  const serialized = JSON.stringify(payload);
  const fingerprint = createHash('sha256').update(JSON.stringify([investigationId, kind, payload])).digest('hex');
  const [exists] = await sql`SELECT id FROM wch_investigations WHERE id = ${investigationId}`;
  if (!exists) throw new SystemError('Investigation not found. Start it first.', 404);
  const data = payload as { supersedesRequestId?: string; sourceRequestIds?: string[] };
  if (data.supersedesRequestId) {
    const [prior] = await sql`SELECT investigation_id, kind FROM wch_events WHERE request_id = ${data.supersedesRequestId}`;
    if (!prior || prior.investigation_id !== investigationId || prior.kind !== kind) throw new SystemError('Correction must refer to an existing record of the same kind in this investigation.');
    if (data.supersedesRequestId === requestId) throw new SystemError('A correction must use a new request ID.');
  }
  if (data.sourceRequestIds?.length) {
    const references = await sql`SELECT request_id FROM wch_events WHERE investigation_id = ${investigationId} AND request_id = ANY(${data.sourceRequestIds}::text[])`;
    if (new Set(references.map(row => row.request_id)).size !== new Set(data.sourceRequestIds).size) throw new SystemError('Output sources must refer to saved records in this investigation.');
  }
  // A stable caller key makes retries safe, including after an uncertain send.
  const inserted = await sql`INSERT INTO wch_events(request_id, investigation_id, kind, payload, fingerprint)
    VALUES (${requestId}, ${investigationId}, ${kind}, ${serialized}::jsonb, ${fingerprint})
    ON CONFLICT (request_id) DO NOTHING RETURNING *`;
  const [row] = inserted.length ? inserted : await sql`SELECT * FROM wch_events WHERE request_id = ${requestId}`;
  if (row.fingerprint !== fingerprint) throw new SystemError('Request ID already belongs to different content. Use a new ID for new content.', 409);
  const { fingerprint: _internal, ...event } = row;
  return { saved: true, repeated: inserted.length === 0, event };
}

export async function recallInvestigation(id: string, limit: number, beforeSequence?: number) {
  const sql = database();
  const [investigation] = await sql`SELECT * FROM wch_investigations WHERE id = ${id}`;
  if (!investigation) throw new SystemError('Investigation not found.', 404);
  const rows = beforeSequence
    ? await sql`SELECT sequence, request_id, investigation_id, kind, payload, created_at FROM wch_events
        WHERE investigation_id = ${id} AND sequence < ${beforeSequence} ORDER BY sequence DESC LIMIT ${limit + 1}`
    : await sql`SELECT sequence, request_id, investigation_id, kind, payload, created_at FROM wch_events
        WHERE investigation_id = ${id} ORDER BY sequence DESC LIMIT ${limit + 1}`;
  const page = rows.slice(0, limit);
  return {
    investigation,
    events: page.slice().reverse(),
    nextBeforeSequence: rows.length > limit ? Number(page[page.length - 1].sequence) : null,
    memoryCoverage: 'Only explicitly saved records are available. Summaries are not verbatim transcripts.',
  };
}

export async function recallOwnerContext(limit: number, beforeSequence?: number) {
  const sql = database();
  const rows = beforeSequence
    ? await sql`SELECT sequence, request_id, investigation_id, kind, payload, created_at FROM wch_events
        WHERE kind IN ('interest','decision','question') AND sequence < ${beforeSequence}
        ORDER BY sequence DESC LIMIT ${limit + 1}`
    : await sql`SELECT sequence, request_id, investigation_id, kind, payload, created_at FROM wch_events
        WHERE kind IN ('interest','decision','question') ORDER BY sequence DESC LIMIT ${limit + 1}`;
  const page = rows.slice(0, limit);
  return {
    records: page.slice().reverse(),
    nextBeforeSequence: rows.length > limit ? Number(page[page.length - 1].sequence) : null,
    instruction: 'Keep explicitly stated interests separate from tentative inferences. Apply corrections using supersedesRequestId; preserve the history.',
  };
}

export async function listInvestigations(limit: number, beforeId?: string) {
  const sql = database();
  const rows = beforeId
    ? await sql`SELECT * FROM wch_investigations WHERE id > ${beforeId} ORDER BY id LIMIT ${limit + 1}`
    : await sql`SELECT * FROM wch_investigations ORDER BY id LIMIT ${limit + 1}`;
  const page = rows.slice(0, limit);
  return { investigations: page, nextAfterId: rows.length > limit ? page[page.length - 1].id : null };
}

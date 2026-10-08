import { createHash } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { RESILIENCE_DDL } from './migrations';
import type { IntelligenceEvent } from './schema';

export class SystemError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export function database() {
  if (!process.env.DATABASE_URL)
    throw new SystemError('System memory is not configured.', 503);
  return neon(process.env.DATABASE_URL, {
    fetchOptions: { signal: AbortSignal.timeout(8000) },
  });
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
  await sql.transaction(
    [...SYSTEM_DDL, ...RESILIENCE_DDL].map((statement) => sql.query(statement)),
  );
}

export async function beginInvestigation(
  companyId: string,
  companyName: string,
  city: string,
  goal: string,
) {
  const sql = database();
  const id = `${city}:${companyId}`;
  await sql`INSERT INTO wch_investigations(id, company_id, company_name, city, initial_goal)
    VALUES (${id}, ${companyId}, ${companyName}, ${city}, ${goal}) ON CONFLICT (id) DO NOTHING`;
  const [row] = await sql`SELECT * FROM wch_investigations WHERE id = ${id}`;
  return row;
}

const fingerprint = (value: unknown) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');

export async function appendEvent(
  investigationId: string,
  requestId: string,
  kind: string,
  payload: unknown,
) {
  const sql = database();
  const [row] =
    await sql`SELECT wch_append_event(${investigationId},${requestId},${kind},${JSON.stringify(payload)}::jsonb,${fingerprint([investigationId, kind, payload])}) AS result`;
  return row.result;
}

export async function saveTurn(
  investigationId: string,
  requestId: string,
  events: IntelligenceEvent[],
) {
  const sql = database();
  const records = events.map((event) => ({
    ...event,
    fingerprint: fingerprint([investigationId, event.kind, event.payload]),
  }));
  const [row] =
    await sql`SELECT wch_save_turn(${investigationId},${requestId},${JSON.stringify(records)}::jsonb,${fingerprint([investigationId, events])}) AS result`;
  return row.result;
}

export async function recallInvestigation(
  id: string,
  limit: number,
  beforeSequence?: number,
) {
  const sql = database();
  const [investigation] =
    await sql`SELECT * FROM wch_investigations WHERE id = ${id}`;
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
    nextBeforeSequence:
      rows.length > limit ? Number(page[page.length - 1].sequence) : null,
    memoryCoverage:
      'Only explicitly saved records are available. Summaries are not verbatim transcripts.',
  };
}

export async function recallOwnerContext(
  limit: number,
  beforeSequence?: number,
  activeOnly = true,
) {
  const sql = database();
  const rows = beforeSequence
    ? await sql`SELECT sequence, request_id, investigation_id, kind, payload, created_at FROM wch_events
        WHERE kind IN ('interest','decision','question') AND sequence < ${beforeSequence}
        AND (NOT ${activeOnly} OR NOT EXISTS (SELECT 1 FROM wch_events newer WHERE newer.payload->>'supersedesRequestId'=wch_events.request_id))
        ORDER BY sequence DESC LIMIT ${limit + 1}`
    : await sql`SELECT sequence, request_id, investigation_id, kind, payload, created_at FROM wch_events
        WHERE kind IN ('interest','decision','question')
        AND (NOT ${activeOnly} OR NOT EXISTS (SELECT 1 FROM wch_events newer WHERE newer.payload->>'supersedesRequestId'=wch_events.request_id))
        ORDER BY sequence DESC LIMIT ${limit + 1}`;
  const page = rows.slice(0, limit);
  return {
    records: page.slice().reverse(),
    nextBeforeSequence:
      rows.length > limit ? Number(page[page.length - 1].sequence) : null,
    instruction:
      'Keep explicitly stated interests separate from tentative inferences. Apply corrections using supersedesRequestId; preserve the history.',
  };
}

export async function listInvestigations(limit: number, beforeId?: string) {
  const sql = database();
  const rows = beforeId
    ? await sql`SELECT * FROM wch_investigations WHERE id > ${beforeId} ORDER BY id LIMIT ${limit + 1}`
    : await sql`SELECT * FROM wch_investigations ORDER BY id LIMIT ${limit + 1}`;
  const page = rows.slice(0, limit);
  return {
    investigations: page,
    nextAfterId: rows.length > limit ? page[page.length - 1].id : null,
  };
}

export async function investigationContext(id: string, limit: number) {
  const sql = database();
  const results = await sql.transaction(
    [
      sql`SELECT * FROM wch_investigations WHERE id=${id}`,
      sql`SELECT sequence,request_id,kind,payload,created_at FROM wch_events e WHERE investigation_id=${id}
    AND kind IN ('interest','decision','question','evidence')
    AND NOT EXISTS(SELECT 1 FROM wch_events newer WHERE newer.payload->>'supersedesRequestId'=e.request_id)
    ORDER BY sequence DESC LIMIT ${limit + 1}`,
      sql`SELECT sequence,request_id,kind,payload,created_at FROM wch_events WHERE investigation_id=${id} AND kind IN ('discussion','output') ORDER BY sequence DESC LIMIT ${limit + 1}`,
    ],
    { isolationLevel: 'RepeatableRead', readOnly: true },
  );
  if (!results[0].length)
    throw new SystemError('Investigation not found.', 404);
  const section = (rows: Record<string, any>[]) => ({
    records: rows.slice(0, limit).reverse(),
    hasMore: rows.length > limit,
    nextBeforeSequence:
      rows.length > limit ? Number(rows[limit - 1].sequence) : null,
  });
  return {
    investigation: results[0][0],
    current: section(results[1]),
    conversation: section(results[2]),
    retrievedAt: new Date().toISOString(),
    guidance:
      'Current records exclude superseded versions across the entire history. Resolved questions retain status=resolved. hasMore means this context is incomplete; use search_memory or recall_investigation. Checked dates are source check dates, not a guarantee of current truth. Only saved turns are available.',
  };
}

export async function searchMemory(
  query: string,
  id: string | undefined,
  limit: number,
  beforeSequence?: number,
) {
  const sql = database();
  const rows =
    await sql`SELECT sequence,request_id,investigation_id,kind,created_at,left(coalesce(payload->>'text',payload->>'claim',payload->>'content',''),1000) AS excerpt
  FROM wch_events e WHERE (${id ?? null}::text IS NULL OR investigation_id=${id ?? null})
  AND (${beforeSequence ?? null}::bigint IS NULL OR sequence < ${beforeSequence ?? null})
  AND to_tsvector('simple',coalesce(payload->>'text',payload->>'claim',payload->>'content','')) @@ plainto_tsquery('simple',${query})
  AND NOT EXISTS(SELECT 1 FROM wch_events newer WHERE newer.payload->>'supersedesRequestId'=e.request_id)
  ORDER BY sequence DESC LIMIT ${limit + 1}`;
  return {
    records: rows.slice(0, limit),
    hasMore: rows.length > limit,
    nextBeforeSequence:
      rows.length > limit ? Number(rows[limit - 1].sequence) : null,
    guidance:
      'Search returns active records and bounded excerpts; use get_record for full evidence and citations. Follow the cursor when hasMore is true.',
  };
}

export async function getRecord(id: string) {
  const sql = database();
  const [row] =
    await sql`SELECT sequence,request_id,investigation_id,kind,payload,created_at,
  (SELECT request_id FROM wch_events newer WHERE newer.payload->>'supersedesRequestId'=e.request_id ORDER BY sequence DESC LIMIT 1) AS superseded_by
  FROM wch_events e WHERE request_id=${id}`;
  if (!row) throw new SystemError('Record not found.', 404);
  return row;
}

export async function systemHealth() {
  const sql = database();
  const [row] =
    await sql`SELECT (SELECT count(*) FROM wch_investigations)::int AS investigations,(SELECT count(*) FROM wch_events)::int AS events,
  (SELECT max(created_at) FROM wch_events) AS last_record_at,to_regprocedure('wch_save_turn(text,text,jsonb,text)') IS NOT NULL AS atomic_turns`;
  if (!row.atomic_turns)
    throw new SystemError('System schema upgrade is required.', 503);
  return {
    status: 'ready',
    schemaVersion: 2,
    checkedAt: new Date().toISOString(),
    ...row,
    memoryCoverage:
      'Only explicitly saved turns; voice-host recording is not implied.',
  };
}

import {
  createHash,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
} from 'node:crypto';
import * as z from 'zod/v4';
import { database, SYSTEM_DDL, SystemError } from './store';
import { RESILIENCE_DDL } from './migrations';
const timestamp = z.union([z.string().datetime({ offset: true }), z.date()]);
const investigationRow = z
  .object({
    id: z.string(),
    company_id: z.string(),
    company_name: z.string(),
    city: z.string(),
    initial_goal: z.string(),
    created_at: timestamp,
  })
  .strict();
const eventRow = z
  .object({
    sequence: z.union([
      z.number().int().positive(),
      z.string().regex(/^[1-9][0-9]*$/),
    ]),
    request_id: z.string(),
    investigation_id: z.string(),
    kind: z.enum([
      'discussion',
      'interest',
      'decision',
      'question',
      'evidence',
      'output',
    ]),
    payload: z.record(z.string(), z.unknown()),
    fingerprint: z.string().regex(/^[a-f0-9]{64}$/),
    created_at: timestamp,
  })
  .strict();
const turnRow = z
  .object({
    request_id: z.string(),
    investigation_id: z.string(),
    fingerprint: z.string().regex(/^[a-f0-9]{64}$/),
    event_ids: z.array(z.string()),
    created_at: timestamp,
  })
  .strict();
const snapshotSchema = z
  .object({
    format: z.literal('wch-snapshot-v1'),
    createdAt: z.string(),
    investigations: z.array(investigationRow),
    events: z.array(eventRow),
    turns: z.array(turnRow),
  })
  .strict();
export type Snapshot = z.infer<typeof snapshotSchema>;
const canonical = (value: unknown): string =>
  JSON.stringify(
    value instanceof Date
      ? value.toISOString()
      : value && typeof value === 'object'
        ? Array.isArray(value)
          ? value.map((item) => JSON.parse(canonical(item)))
          : Object.fromEntries(
              Object.entries(value)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, val]) => [key, JSON.parse(canonical(val))]),
            )
        : value,
  );
export const snapshotHash = (snapshot: Snapshot) =>
  createHash('sha256')
    .update(
      canonical({
        investigations: snapshot.investigations,
        events: snapshot.events,
        turns: snapshot.turns,
      }),
    )
    .digest('hex');
function key(value: string) {
  if (!/^[0-9a-f]{64}$/i.test(value))
    throw new SystemError(
      'A private 32-byte hexadecimal backup key is required.',
    );
  return Buffer.from(value, 'hex');
}
export function encryptSnapshot(snapshot: Snapshot, secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(secret), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(snapshot), 'utf8'),
    cipher.final(),
  ]);
  return JSON.stringify({
    format: 'wch-encrypted-v1',
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  });
}
export function decryptSnapshot(encoded: string, secret: string): Snapshot {
  try {
    const envelope = z
      .object({
        format: z.literal('wch-encrypted-v1'),
        iv: z.string(),
        tag: z.string(),
        ciphertext: z.string(),
      })
      .strict()
      .parse(JSON.parse(encoded));
    const decipher = createDecipheriv(
      'aes-256-gcm',
      key(secret),
      Buffer.from(envelope.iv, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(envelope.tag, 'base64'));
    return snapshotSchema.parse(
      JSON.parse(
        Buffer.concat([
          decipher.update(Buffer.from(envelope.ciphertext, 'base64')),
          decipher.final(),
        ]).toString('utf8'),
      ),
    );
  } catch {
    throw new SystemError(
      'Backup authentication failed or its format is invalid. No restore was attempted.',
    );
  }
}
export async function takeSnapshot(): Promise<Snapshot> {
  const sql = database();
  const [investigations, events, turns] = await sql.transaction(
    [
      sql`SELECT * FROM wch_investigations ORDER BY id`,
      sql`SELECT * FROM wch_events ORDER BY sequence`,
      sql`SELECT * FROM wch_turns ORDER BY request_id`,
    ],
    { isolationLevel: 'RepeatableRead', readOnly: true },
  );
  return snapshotSchema.parse({
    format: 'wch-snapshot-v1',
    createdAt: new Date().toISOString(),
    investigations,
    events,
    turns,
  });
}
export async function restoreSnapshot(input: Snapshot, rehearsal = true) {
  const snapshot = snapshotSchema.parse(input);
  const sql = database();
  const schema = `wch_recovery_${randomUUID().replace(/-/g, '')}`;
  const setup = rehearsal
    ? [`CREATE SCHEMA ${schema}`, `SET LOCAL search_path TO ${schema}`]
    : [];
  const commands = [
    ...setup,
    ...SYSTEM_DDL,
    ...RESILIENCE_DDL,
    'LOCK TABLE wch_investigations,wch_events,wch_turns IN ACCESS EXCLUSIVE MODE',
    `DO $$ BEGIN IF EXISTS(SELECT 1 FROM wch_investigations) OR EXISTS(SELECT 1 FROM wch_events) OR EXISTS(SELECT 1 FROM wch_turns) THEN RAISE EXCEPTION 'Restore target must be empty; existing data is never overwritten.' USING ERRCODE='P0412'; END IF; END $$`,
    `CREATE OR REPLACE FUNCTION wch_assert_restore(valid boolean) RETURNS boolean LANGUAGE plpgsql AS $$ BEGIN IF NOT valid THEN RAISE EXCEPTION 'Restored rows differ from the backup.' USING ERRCODE='P0500'; END IF; RETURN true; END $$`,
  ];
  const queries = commands.map((command) => sql.query(command));
  queries.push(
    sql`INSERT INTO wch_investigations SELECT * FROM jsonb_populate_recordset(NULL::wch_investigations,${JSON.stringify(snapshot.investigations)}::jsonb)`,
  );
  queries.push(
    sql`INSERT INTO wch_events SELECT * FROM jsonb_populate_recordset(NULL::wch_events,${JSON.stringify(snapshot.events)}::jsonb)`,
  );
  queries.push(
    sql`INSERT INTO wch_turns SELECT * FROM jsonb_populate_recordset(NULL::wch_turns,${JSON.stringify(snapshot.turns)}::jsonb)`,
  );
  queries.push(
    sql`SELECT setval(pg_get_serial_sequence('wch_events','sequence'),coalesce((SELECT max(sequence) FROM wch_events),1),(SELECT count(*)>0 FROM wch_events))`,
  );
  queries.push(sql`SELECT wch_assert_restore(
  NOT EXISTS((SELECT * FROM wch_investigations EXCEPT SELECT * FROM jsonb_populate_recordset(NULL::wch_investigations,${JSON.stringify(snapshot.investigations)}::jsonb)) UNION ALL (SELECT * FROM jsonb_populate_recordset(NULL::wch_investigations,${JSON.stringify(snapshot.investigations)}::jsonb) EXCEPT SELECT * FROM wch_investigations))
  AND NOT EXISTS((SELECT * FROM wch_events EXCEPT SELECT * FROM jsonb_populate_recordset(NULL::wch_events,${JSON.stringify(snapshot.events)}::jsonb)) UNION ALL (SELECT * FROM jsonb_populate_recordset(NULL::wch_events,${JSON.stringify(snapshot.events)}::jsonb) EXCEPT SELECT * FROM wch_events))
  AND NOT EXISTS((SELECT * FROM wch_turns EXCEPT SELECT * FROM jsonb_populate_recordset(NULL::wch_turns,${JSON.stringify(snapshot.turns)}::jsonb)) UNION ALL (SELECT * FROM jsonb_populate_recordset(NULL::wch_turns,${JSON.stringify(snapshot.turns)}::jsonb) EXCEPT SELECT * FROM wch_turns))
 )`);
  const readAt = queries.length;
  queries.push(
    sql`SELECT * FROM wch_investigations ORDER BY id`,
    sql`SELECT * FROM wch_events ORDER BY sequence`,
    sql`SELECT * FROM wch_turns ORDER BY request_id`,
  );
  if (rehearsal) queries.push(sql.query(`DROP SCHEMA ${schema} CASCADE`));
  const result = await sql.transaction(queries);
  const restored = snapshotSchema.parse({
    ...snapshot,
    investigations: result[readAt],
    events: result[readAt + 1],
    turns: result[readAt + 2],
  });
  if (snapshotHash(snapshot) !== snapshotHash(restored))
    throw new SystemError(
      'Restored data differs from the backup. Do not use this recovery target.',
      503,
    );
  return {
    verified: true,
    rehearsal,
    events: snapshot.events.length,
    investigations: snapshot.investigations.length,
    turns: snapshot.turns.length,
    sha256: snapshotHash(snapshot),
  };
}

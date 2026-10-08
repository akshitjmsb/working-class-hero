import * as z from 'zod/v4';
export const text = z.string().trim().min(1).max(30000);
export const requestId = z.string().min(8).max(200);
export const investigationId = z.string().min(1).max(200);
export const sourceRef = z.string().min(1).max(1000);
export const discussionPayload = z
  .object({
    speaker: z.enum(['user', 'robby']),
    text,
    recordType: z.enum(['verbatim', 'summary']),
    sourceRef,
    occurredAt: z.iso.datetime({ offset: true }).optional(),
  })
  .strict();
export const memoryPayload = z
  .object({
    text,
    provenance: z.enum(['user_stated', 'robby_inferred']),
    sourceRef,
    supersedesRequestId: requestId.optional(),
    status: z.enum(['open', 'resolved']).optional(),
  })
  .strict();
export const evidencePayload = z
  .object({
    claim: text,
    evidenceType: z.enum(['observed', 'analysis', 'unknown']),
    sources: z
      .array(
        z
          .object({
            url: z.url().refine((url) => /^https?:\/\//.test(url)),
            title: z.string().min(1).max(300),
            publishedAt: z.string().max(100).optional(),
          })
          .strict(),
      )
      .max(20),
    checkedAt: z.iso.datetime({ offset: true }),
    sourceRef,
    supersedesRequestId: requestId.optional(),
  })
  .strict();
export const outputPayload = z
  .object({
    title: z.string().min(1).max(300),
    format: z.enum(['voice_brief', 'markdown', 'html', 'structured_json']),
    content: z.string().min(1).max(150000),
    sourceRequestIds: z.array(requestId).max(200),
    sourceRef,
  })
  .strict();
export const eventSchema = z
  .discriminatedUnion('kind', [
    z
      .object({
        requestId,
        kind: z.literal('discussion'),
        payload: discussionPayload,
      })
      .strict(),
    z
      .object({
        requestId,
        kind: z.enum(['interest', 'decision', 'question']),
        payload: memoryPayload,
      })
      .strict(),
    z
      .object({
        requestId,
        kind: z.literal('evidence'),
        payload: evidencePayload,
      })
      .strict(),
    z
      .object({ requestId, kind: z.literal('output'), payload: outputPayload })
      .strict(),
  ])
  .superRefine((event, ctx) => {
    if (event.kind === 'decision' && event.payload.provenance !== 'user_stated')
      ctx.addIssue({
        code: 'custom',
        message: 'Decisions require explicit owner provenance.',
      });
    if (
      event.kind === 'evidence' &&
      event.payload.evidenceType === 'observed' &&
      !event.payload.sources.length
    )
      ctx.addIssue({
        code: 'custom',
        message: 'Observed facts require sources.',
      });
    if (
      ['interest', 'decision'].includes(event.kind) &&
      'status' in event.payload &&
      event.payload.status
    )
      ctx.addIssue({
        code: 'custom',
        message: 'Only questions have resolution status.',
      });
  });
export type IntelligenceEvent = z.infer<typeof eventSchema>;

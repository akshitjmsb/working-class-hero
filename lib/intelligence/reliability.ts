import { SystemError } from './store';
import { ZodError } from 'zod/v4';

export function publicError(error: unknown) {
  if (error instanceof SystemError)
    return {
      status: error.status,
      message: error.message,
      retryable: error.status >= 500,
    };
  if (error instanceof ZodError || error instanceof SyntaxError)
    return {
      status: 400,
      message: 'Invalid system request. Check the tool schema.',
      retryable: false,
    };
  const code = (error as { code?: string })?.code;
  const messages: Record<string, [number, string]> = {
    P0412: [
      409,
      'Restore target contains records. Existing data is never overwritten.',
    ],
    P0400: [400, 'Invalid record reference or duplicate event ID.'],
    P0404: [404, 'Investigation not found. Start it first.'],
    P0409: [
      409,
      'Conflicting request ID or correction. Recall current context before changing the record.',
    ],
  };
  if (code && messages[code])
    return {
      status: messages[code][0],
      message: messages[code][1],
      retryable: false,
    };
  return {
    status: 503,
    message:
      'System memory is unavailable; a database save is not confirmed. Retry unchanged content with the same request ID.',
    retryable:
      !code || ['40001', '40P01', '53300', '57P01', '08006'].includes(code),
  };
}

export async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const safe = publicError(error);
      if (attempt >= 1 || !safe.retryable)
        throw new SystemError(safe.message, safe.status);
      await new Promise((resolve) =>
        setTimeout(resolve, 150 + Math.floor(Math.random() * 150)),
      );
    }
  }
}

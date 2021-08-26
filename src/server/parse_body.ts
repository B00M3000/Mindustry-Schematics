import type { BaseBody } from '@sveltejs/kit/types/helper';

export function parseForm<T = Record<string, unknown>>(body: BaseBody): Partial<T> {
  if (body instanceof Buffer || body instanceof Uint8Array)
    throw new Error('Cannot convert buffer to record');
  if (typeof body === 'string') {
    return JSON.parse(body);
  }
  if ('entries' in body) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of body) {
      result[key] = value;
    }
    return result as T;
  }
  return body;
}

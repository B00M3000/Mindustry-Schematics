import type { ParameterizedBody } from '@sveltejs/kit/types/app';

export function parseForm<T = Record<string, unknown>>(
  body: ParameterizedBody,
): Partial<T> {
  if (body instanceof Buffer || body instanceof Uint8Array || !body)
    throw new Error('Invalid body type');
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

<<<<<<< HEAD
import type { BaseBody } from '@sveltejs/kit/types/helper';

export function parseForm<T = Record<string, unknown>>(body: BaseBody): Partial<T> {
  if (body instanceof Buffer) throw new Error('Cannot convert buffer to record');
=======
import type { ParameterizedBody } from '@sveltejs/kit/types/app';

export function parseForm<T = Record<string, unknown>>(
  body: ParameterizedBody,
): Partial<T> {
  if (body instanceof Buffer || body instanceof Uint8Array || !body)
    throw new Error('Invalid body type');
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
  if (typeof body === 'string') {
    return JSON.parse(body);
  }
  if ('entries' in body) {
<<<<<<< HEAD
    const values = body.entries();
    const result: Record<string, unknown> = {};
    let current;
    while ((current = values.next()) && !current.done) {
      result[current.value[0]] = current.value[1];
=======
    const result: Record<string, unknown> = {};
    for (const [key, value] of body) {
      result[key] = value;
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
    }
    return result as T;
  }
  return body;
}

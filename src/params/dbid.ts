import type { ParamMatcher } from '@sveltejs/kit';
import { isObjectIdOrHexString } from 'mongoose';

// extracted from
// https://github.com/Automattic/mongoose/blob/44530a6fc36392ff4cdcf0300cd8baa856d80b78/lib/index.js#L45
const objectIdHexRegexp = /^[0-9A-Fa-f]{24}$/;

/**
 * Sveltekit matcher. Matches mongodb database ids.
 */
export const match: ParamMatcher = (param) => {
  if (typeof window === 'undefined') return isObjectIdOrHexString(param);

  // hard coded check for browsers
  return objectIdHexRegexp.test(param);
};

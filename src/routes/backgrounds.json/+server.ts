import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readdirSync } from 'fs';
import path from 'path';
let paths: string[] | undefined;
export const GET: RequestHandler = () => {
  if (!paths)
    paths = readdirSync('static/assets/backgrounds').map((file) =>
      path.join('/assets/backgrounds', file).replace(/\\/g, '/'),
    );
  return json(paths, {
    headers: {
      'cache-control': 'max-age=86400', // cache for 1 day
    },
  });
};

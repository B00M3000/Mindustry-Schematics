import type { Locals } from '@/interfaces/app';
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
let paths: string[] | undefined;
export const get: RequestHandler<Locals, unknown, string[]> = () => {
  if (!paths)
    paths = fs
      .readdirSync(path.resolve('static/assets/backgrounds'))
      .map((file) => path.join('/assets/backgrounds', file).replace(/\\/g, '/'));
  return {
    status: 200,
    headers: {
      'cache-control': 'max-age=86400', // cache for 1 day
    },
    body: paths,
  };
};

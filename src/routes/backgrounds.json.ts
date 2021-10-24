import type { Locals } from '@/interfaces/app';
import type { RequestHandler } from '@sveltejs/kit';
import { readdir } from 'fs/promises';
import path from 'path';
let paths: string[] | undefined;
export const get: RequestHandler<Locals, unknown, string[]> = async () => {
  if (!paths)
    paths = (await readdir('static/assets/backgrounds')).map((file) =>
      path.join('/assets/backgrounds', file).replace(/\\/g, '/'),
    );
  return {
    status: 200,
    headers: {
      'cache-control': 'max-age=86400', // cache for 1 day
    },
    body: paths,
  };
};

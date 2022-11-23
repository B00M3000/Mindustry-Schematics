import { UserSchema } from '@/server/mongo';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
  const user_id = url.searchParams.get('user');

  if (user_id) {
    const user = await UserSchema.findOne({ _id: user_id });
    if (user) {
      return json(user.avatar_url);
    }
    throw error(404, 'User not found');
  }

  if (locals.user) return json(locals.user?.avatar_url);

  throw error(400, 'Missing user id');
};

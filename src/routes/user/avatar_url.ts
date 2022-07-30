import type { RequestHandler } from '@sveltejs/kit';
import { UserSchema } from '@/server/mongo';

export const get: RequestHandler<never> = async ({ locals, url }) => {
  const user_id = url.searchParams.get('user');

  if (user_id) {
    const user = await UserSchema.findOne({ _id: user_id });
    if (user) {
      return { body: user.avatar_url };
    }
    return { status: 404, body: 'User not found' };
  }

  if (locals.user) return { body: locals.user?.avatar_url };

  return { status: 400, body: 'Missing user id' };
};

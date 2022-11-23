import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { UserSchema } from '@/server/mongo';
import type { BasicUserJSON } from '@/interfaces/json';

export const GET: RequestHandler = async ({ params }) => {
  const user = await UserSchema.findOne({ _id: params.id });

  if (!user) throw error(404, 'User not found');

  return json({
    id: user._id,
    avatar_url: user.avatar_url,
    username: user.username,
    access: user.access,
    verified: user.verified,
  } satisfies BasicUserJSON);
};

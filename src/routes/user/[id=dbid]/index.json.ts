import type { RequestHandler } from './__types/index.json';
import { UserSchema } from '@/server/mongo';
import type { BasicUserJSON } from '@/interfaces/json';

export const GET: RequestHandler<BasicUserJSON | { message: string }> = async (req) => {
  const user = await UserSchema.findOne({ _id: req.params.id });

  if (!user) return { status: 404, body: { message: 'User not found' } };

  return {
    status: 200,
    body: {
      id: user._id,
      avatar_url: user.avatar_url,
      username: user.username,
      access: user.access,
      verified: user.verified,
    },
  };
};

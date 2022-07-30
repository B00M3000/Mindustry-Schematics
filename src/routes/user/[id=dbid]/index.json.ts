import type { RequestHandler } from '@sveltejs/kit';
import env from '@/server/env';

import { UserSchema } from '@/server/mongo';

export const GET: RequestHandler = async (req) => {
  const user = await UserSchema.findOne({ _id: req.params.id });

  if (!user) return { status: 400, body: { message: 'Invalid User ID ' } };

  return {
    status: 200,
    body: {
      ...user._doc,
      id: user._id,
    },
  };
};

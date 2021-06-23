import { UserSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (req) => {
  const uid = req.params.uid;
  const user = await UserSchema.findOne({ _id: uid });

  if (!user)
    return {
      status: 404,
      body: {
        message: "Couldn't Find a User with that UID",
      },
    };

  return {
    status: 200,
    body: user,
  };
};

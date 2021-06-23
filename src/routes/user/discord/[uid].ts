import { UserSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
// TODO: make this more secure
// this endpoint could be easily used to get the data of users without their consent
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

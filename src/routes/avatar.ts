import { UserSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (req) => {
  const user = await UserSchema.findOne({ _id: req.locals.id }, 'username avatar');

  if (!user) return { status: 404, body: 'Not found' };
  const body = user.avatar;
  const filename = encodeURIComponent(user.username);
  return {
    status: 200,
    headers: {
      'cache-control': 'max-age=1800',
      'content-disposition': `inline; filename="${filename}.png"`,
      'content-type': 'image/*',
      'content-length': body.length.toString(),
    },
    body,
  };
};

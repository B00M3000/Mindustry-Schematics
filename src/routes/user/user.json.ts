import type { RequestHandler } from '@sveltejs/kit';
import { UserSchema } from '@/server/mongo';
import { parseForm } from '@/server/parse_body';

interface PostBody {
  username: string;
}
export const post: RequestHandler = async (req) => {
  const parsedForm = parseForm<PostBody>(req.body);
  const { username } = parsedForm;
  const { id } = req.locals;

  if (!id)
    return {
      status: 308,
      headers: { location: '/user' },
      body: { message: 'User is not Authenticated' },
    };

  if (!username)
    return {
      status: 308,
      headers: { location: '/user' },
      body: { message: 'Invalid Body' },
    };

  await UserSchema.findOneAndUpdate({ _id: id }, { username });

  return {
    status: 308,
    headers: { location: '/user' },
    body: { message: 'Username Updated Successfully' },
  };
};

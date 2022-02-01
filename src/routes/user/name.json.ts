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
      status: 401,
      body: { message: 'User is not Authenticated' },
    };

  if (!username)
    return {
      status: 400,
      body: { message: 'Invalid Body' },
    };

  const returnUser = await UserSchema.findOneAndUpdate({ _id: id }, { username });

  return {
    status: 200,
    body: { message: 'Username Updated Successfully', user: returnUser },
  };
};

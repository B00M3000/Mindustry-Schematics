import type { RequestHandler } from '@sveltejs/kit';
import { UserSchema } from '@/server/mongo';
import { parseForm } from '@/server/parse_body';

interface PostBody {
  content_type: string;
  data: string;
}

export const post: RequestHandler = async (req) => {
  const parsedForm = parseForm<PostBody>(req.body);
  const { content_type, data } = parsedForm;
  const { id } = req.locals;

  if (!id)
    return {
      status: 308,
      headers: { location: '/user' },
      body: { message: 'User is not Authenticated' },
    };

  if (!content_type || !data)
    return {
      status: 308,
      headers: { location: '/user' },
      body: { message: 'Invalid Body' },
    };

  const base64 = Buffer.from(data, 'base64');

  await UserSchema.findOneAndUpdate(
    { _id: id },
    {
      avatar: `data:${content_type};base64,${base64}`,
    },
  );

  return {
    status: 308,
    headers: { location: '/user' },
    body: { message: 'Avatar Updated Successfully' },
  };
};

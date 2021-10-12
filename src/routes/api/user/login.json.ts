import type { Locals } from '@/interfaces/app';
import { User } from '@/server/auth/user';
import { parseForm } from '@/server/parse_body';
import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';

interface BodyJSON {
  token: string;
}
interface PostInput {
  token: string;
}
type PostOutput =
  | {
      message: string;
    }
  | {
      name: string;
      access: string;
    };
export const post: RequestHandler<Locals, PostInput, PostOutput> = async (req) => {
  const { token } = parseForm<BodyJSON>(req.body);
  if (!token)
    return {
      status: 400,
      body: { message: 'Missing auth token' },
    };
  const user = await User.get(token);
  if (!user)
    return {
      status: 404,
      body: {
        message: 'The token is not registered',
      },
    };
  return {
    headers: {
      location: '/user',
      'set-cookie': cookie.serialize('token', token, {
        path: '/',
      }),
    },
    body: {
      name: user.name,
      access: user.access.name,
    },
  };
};

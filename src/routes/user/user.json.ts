import type { RequestHandler } from '@sveltejs/kit';
import { SessionSchema, UserSchema } from '@/server/mongo';
import * as cookie from 'cookie';
import { parseForm } from '@/server/parse_body';

export const post: RequestHandler = (req) => {
  const parsedForm = parseForm<Body>(req.body);
  let { username } = parsedForm;
  let { id } = req.locals

  if(!id) return {
    status: 308,
    headers: { location: '/user' },
    body: { message: 'User is not Authenticated' },
  };

  if(!username) return {
    status: 308,
    headers: { location: '/user' },
    body: { message: 'Invalid Body' },
  };

  const result = await UserSchema.findOneAndUpdate({ _id: id }, { username })
  
  return {
    status: 308,
    headers: { location: '/user' },
    body: { message: 'Username Updated Successfully' },
  };
};

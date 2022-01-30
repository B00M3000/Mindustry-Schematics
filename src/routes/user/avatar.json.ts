import type { RequestHandler } from '@sveltejs/kit';
import { SessionSchema, UserSchema } from '@/server/mongo';
import * as cookie from 'cookie';
import { parseForm } from '@/server/parse_body';

export const post: RequestHandler = (req) => {
  const parsedForm = parseForm<Body>(req.body);
  let { content_type, data } = parsedForm;
  let { id } = req.locals

  if(!id) return {
    status: 308,
    headers: { location: '/user' },
    body: { message: 'User is not Authenticated' },
  };

  if(!content_type || !data) return {
    status: 308,
    headers: { location: '/user' },
    body: { message: 'Invalid Body' },
  };

  const base64 = Buffer.from(data, "base64");

  const result = await UserSchema.findOneAndUpdate({ _id: id }, {
    avatar: `data:${content_type};base64,${base64}`
  })
  
  return {
    status: 308,
    headers: { location: '/user' },
    body: { message: 'Avatar Updated Successfully' },
  };
};

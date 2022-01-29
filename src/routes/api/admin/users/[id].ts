import type { Context } from '@/interfaces/app';
import { Access, UserAccess } from '@/lib/auth/access';
import { UserSchema } from '@/server/mongo';
import { parseForm } from '@/server/parse_body';
import type { RequestHandler } from '@sveltejs/kit';
interface Params {
  verified: boolean;
  access: string;
}
export const post: RequestHandler<Context> = async ({ context, body, params }) => {
  const { verified, access } = parseForm<Params>(body);
  const userAccess = UserAccess.from(context.access);
  if (!userAccess.can({ users: Access.readAll | Access.updateAll }))
    return {
      status: 403,
      body: {
        message: 'Forbidden access',
      },
    };
  if (!(verified && access))
    return {
      status: 400,
      body: {
        message: 'Missing required fields',
      },
    };
  if (context.uid == params.id)
    return {
      status: 401,
      body: {
        message: "A user can't modify its own privileges",
      },
    };
  const newAccess = UserAccess.from(access);
  if (newAccess.compare(userAccess) > 0)
    return {
      status: 401,
      body: {
        message: "You can't promove a user to a level higher than yours",
      },
    };
  await UserSchema.findOneAndUpdate(
    {
      id: params.id,
    },
    {
      verified,
      access,
    },
  );
  return {
    status: 200,
    body: {
      message: 'ok',
    },
  };
};

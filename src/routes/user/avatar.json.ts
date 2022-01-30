import type { RequestHandler } from '@sveltejs/kit';
import { UserSchema, DiscordSchema } from '@/server/mongo';
import { parseForm } from '@/server/parse_body';

interface PostBody {
  content_type: string;
  data: string;
  id: string;
}

export const post: RequestHandler = async (req) => {
  const parsedForm = parseForm<PostBody>(req.body);
  const { content_type, data, id } = parsedForm;
  //const { id } = req.locals;

  if (!id)
    return {
      status: 308,
      headers: { location: '/user' },
      body: { message: 'User is not Authenticated' },
    };

  if (!content_type || !data) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = (await UserSchema.findOne({ _id: id }))!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const discord_user = (await DiscordSchema.findOne({ id: user!.discord_id }))!;

    const avatar_url =
      'https://cdn.discordapp.com/avatars/' +
      (discord_user.avatar_hash
        ? `${discord_user.id}/${discord_user.avatar_hash}.png`
        : `${getRandomInt(5)}.png`);

    console.log(avatar_url);

    const response = await fetch(avatar_url, {
      headers: {
        'Content-Type': 'image/png; charset=UTF-8',
      },
    });

    const imageBuffer = await response.arrayBuffer();

    await UserSchema.findOneAndUpdate(
      { _id: id },
      {
        avatar: imageToDataURL('image/png', imageBuffer),
      },
    );

    return {
      status: 308,
      headers: { location: '/user' },
      body: { message: 'Reset Avatar to Discord Avatar' },
    };
  }

  await UserSchema.findOneAndUpdate(
    { _id: id },
    {
      avatar: imageToDataURL(content_type, data),
    },
  );

  return {
    status: 308,
    headers: { location: '/user' },
    body: { message: 'Avatar Updated Successfully' },
  };
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function imageToDataURL(content_type: string, data: ArrayBuffer | string) {
  const base64 = typeof data === 'string' ? data : Buffer.from(data).toString('base64');
  return `data:${content_type};base64,${base64}`;
}

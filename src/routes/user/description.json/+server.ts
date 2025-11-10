import { UserSchema } from '@/server/mongo';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseFormData } from '@/server/body_parsing';

export const POST: RequestHandler = async ({ locals, url, request }) => {
  if(locals.user){
    const newDescription = (await parseFormData(request.body)).description
    await UserSchema.updateOne({ _id: locals.user.id }, { description: newDescription })
    return json({ message: "Description is was updated."}, { status: 200 })
  }
  throw error(403)
};

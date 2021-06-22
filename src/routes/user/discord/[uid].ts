import fetch from 'node-fetch';
import FormData from 'form-data';

import { UserSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import { WEBSITE_URL, DISCORD_APPLICATION_ID, DISCORD_APPLICATION_SECRET } from '@/server/env';
import * as cookie from 'cookie'

export const get: RequestHandler = async (req) => {
  const code = req.params.uid
  
  const user = await UserSchema.findOne({id: uid})
  
  if(!user){
    status: 404,
    body: {
      message: "Couldn't Find a User with that UID"
    }
  }
  
  return {
    status: 200,
    body: user
  };
};

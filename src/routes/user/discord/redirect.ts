import { SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import { DISCORD_APPLICATION_ID } from '@/server/env';

export const get: RequestHandler = async (req) => {
  
  return {
    status: 308,
    headers: {
      location: `/user`
      'set-cookie': 
    },
    body: {
      message: "Redirect to User Dashboard"
    }
  };
};

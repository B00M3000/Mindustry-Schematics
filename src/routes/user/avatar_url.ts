import type { RequestHandler } from '@sveltejs/kit';
import { UserSchema } from '@/server/mongo'
import * as cookie from 'cookie';

export const get: RequestHandler<never> = async (req) => {
    const user_id = req.url.searchParams.get('user')
    
    if(user_id){
        const user = await UserSchema.findOne({ _id: user_id })
        if(user){
            return { body: user.avatar_url };
        } else {
            return { status: 400, body: "Invalid User Id" };
        }
    } else {
        return { body: req.locals.user.avatar_url };
    }
};

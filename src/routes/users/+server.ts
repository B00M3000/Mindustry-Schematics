import { UserSchema } from '@/server/mongo';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
    if(!locals.user || !(locals.user?.access?.toString() == "admin")) return json({ messsage: "Not authorized to make changes to users."}, { status: 403 })

    const modificationRequest = await request.json()
    .catch(() => console.log('Syntax Error in Votes JSON Array Provided.'));

    if(modificationRequest === undefined) return json({ body: { message: "Syntax Error in Modification Request JSON Object."} }, { status: 400 })

    await UserSchema.updateOne({ _id: modificationRequest.user_id }, {
        verified: modificationRequest.verified,
        access: modificationRequest.access, 
    })

    return json({ message: "Changes made successfully." }, { status: 200 })
};
import type { RequestHandler } from '@sveltejs/kit';

import { SchematicSchema } from '@/server/mongo';

export const GET: RequestHandler = async (req) => {
    const schematics = await SchematicSchema.find({ creator_id: req.params.id })

    if(!schematics) return { status: 404, body: { message: "No schematics found for this user." } }

    return {
        status: 200,
        body: {
            schematics
        },
    };
};
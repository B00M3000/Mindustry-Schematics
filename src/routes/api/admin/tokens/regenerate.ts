import type { Context } from "@/interfaces/app";
import type { RequestHandler } from "@sveltejs/kit";
export const post: RequestHandler<Context> = async (req) => {
	if (!req.context.isAdmin)
		return {
			status: 403,
			headers: {
				location: "/",
			},
			body: "Forbidden",
		};
	// TODO: replace this with uuid
	const preffix = new Date().getTime().toString(36);
	const suffix = Math.floor(Math.random() * 100000).toString(36);
	const token = preffix + suffix;
	return {
		status: 200,
		body: {
			token,
		},
	};
};

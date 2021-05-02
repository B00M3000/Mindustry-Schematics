import { getTutorials } from "@/server/tutorials";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async (req) => {
	const { name } = req.params;
	const tutorials = getTutorials();
	const tutorial = tutorials.get(name);

	if (!tutorial)
		return {
			status: 404,
		};
	return {
		status: 200,
		body: {
			title: tutorial.title,
			html: tutorial.html,
		},
	};
};

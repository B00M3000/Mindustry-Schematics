import { getTutorials } from "@/server/tutorials";
import type { RequestHandler } from "@sveltejs/kit";
interface TutorialInfo {
	title: string;
	name: string;
}
export const get: RequestHandler = async () => {
	const tutorials = getTutorials();
	const body: TutorialInfo[] = [];
	tutorials.forEach((value, key) => {
		body.push({
			title: value.title,
			name: key,
		});
	});
	return {
		status: 200,
		body,
	};
};

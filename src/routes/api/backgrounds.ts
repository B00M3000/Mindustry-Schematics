import type { RequestHandler } from "@sveltejs/kit";
import fs from "fs";
import path from "path";
export const get: RequestHandler = async () => {
	const paths = fs
		.readdirSync(path.resolve("static/assets/backgrounds"))
		.map((file) => path.join("/assets/backgrounds", file).replace(/\\/g, "/"));
	return {
		status: 200,
		body: paths,
	};
};

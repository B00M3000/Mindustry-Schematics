import cookie from "cookie";
// import { v4 as uuid } from "@lukeed/uuid";
import type { GetContext, GetSession, Handle } from "@sveltejs/kit";
import mongo from "@/server/mongo";
import type { Context, Session } from "./interfaces/app";
import { User } from "./server/auth";
/** **This function should not be imported manually** */
export const getContext: GetContext<Context> = async (request) => {
	await mongo();
	const cookies = cookie.parse(request.headers.cookie || "");
	const user = await User.get(cookies.token);
	return {
		name: user?.name,
		token: user?.token,
		...User.levels(user),
	};
};
export const getSession: GetSession<Context, Session> = async ({ context }) => {
	return {
		isAdmin: context.isAdmin,
		isMod: context.isMod,
		name: context.name,
		token: context.token,
	};
};
export const handle: Handle = async ({ request, render }) => {
	// TODO https://github.com/sveltejs/kit/issues/1046
	const response = await render({
		...request,
		method: (request.query.get("_method") || request.method).toUpperCase(),
	});

	// const { is_new, userid } = request.context;

	// if (is_new) {
	// 	// if this is the first time the user has visited this app,
	// 	// set a cookie so that we recognise them when they return
	// 	return {
	// 		...response,
	// 		headers: {
	// 			...response.headers,
	// 			"set-cookie": `userid=${userid}; Path=/; HttpOnly`,
	// 		},
	// 	};
	// }

	return response;
};

import type { Context } from "@/interfaces/app";
import { User } from "@/server/auth";
import { parseForm } from "@/server/parse_body";
import type { RequestHandler } from "@sveltejs/kit";
import * as cookie from "cookie";

interface BodyJSON {
	token: string;
}
export const post: RequestHandler<Context> = async (req) => {
	const { token } = parseForm<BodyJSON>(req.body);
	if (!token)
		return {
			status: 400,
			body: "Missing auth token",
		};
	const user = await User.get(token);
	if (!user)
		return {
			status: 404,
			body: {
				message: "The token is not registered",
			},
		};
	return {
		headers: {
			Location: "/user",
			"set-cookie": cookie.serialize("token", token, {
				path: "/",
			}),
		},
		body: {
			name: user.name,
			...User.levels(user),
		},
	};
};

import type { BaseBody } from "@sveltejs/kit/types/helper";

export function parseForm<T = Record<string, unknown>>(body: BaseBody): Partial<T> {
	if (body instanceof Buffer) throw new Error("Cannot convert buffer to record");
	if (typeof body === "string") {
		return JSON.parse(body);
	}
	if ("entries" in body) {
		const values = body.entries();
		const result: Record<string, unknown> = {};
		let current;
		while ((current = values.next()) && !current.done) {
			result[current.value[0]] = current.value[1];
		}
		return result as T;
	}
	return body;
}

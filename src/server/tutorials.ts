import showdown from "showdown";
import fs from "fs";
import path from "path";

const converter = new showdown.Converter();
export class Tutorial {
	constructor(path: string) {
		this.path = path;
	}

	readonly path: string;

	get text(): string {
		return fs.readFileSync(this.path, "utf-8");
	}

	get title(): string {
		const searchRegex = /^#[^#\n\r][^\n\r]+$/m;
		return searchRegex.exec(this.text)?.[0].replace("#", "") ?? "";
	}

	get html(): string {
		return converter.makeHtml(this.text);
	}
}
let tutorials: Map<string, Tutorial>;
export function getTutorials(): Map<string, Tutorial> {
	if (tutorials) return tutorials;
	const folder = path.resolve("tutorials");
	tutorials = new Map<string, Tutorial>();
	if (!fs.existsSync(folder)) return tutorials;
	const files = fs.readdirSync(folder);
	for (const file of files) {
		if (!file.endsWith(".md")) continue;
		const filepath = path.join(folder, file);
		tutorials.set(file, new Tutorial(filepath));
	}
	return tutorials;
}

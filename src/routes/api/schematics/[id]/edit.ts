import { SchematicChangeSchema, SchematicSchema } from "@/server/mongo";
import type { Tag } from "@/interfaces/tag";
import type { RequestHandler } from "@sveltejs/kit";
import Tags from "@/../tags.json";
import { Schematic } from "mindustry-schematic-parser";
import { parseForm } from "@/server/parse_body";
interface Body {
	name: string;
	creator: string;
	text: string;
	description: string;
	tags: string;
	cDescription: string;
}
export const post: RequestHandler = async (req) => {
	const originalSchematic = await SchematicSchema.findOne({
		_id: req.params.id,
	});
	if (!originalSchematic)
		return {
			status: 404,
			headers: {
				location: "/",
			},
			body: "Not found",
		};
	// eslint-disable-next-line prefer-const
	let { name, creator, text, description, cDescription, tags: stringTags } = parseForm<Body>(
		req.body,
	);
	if (!text || !name || !creator || !description || !cDescription || !stringTags) {
		return {
			status: 400,
			body: "Missing required data",
		};
	}
	let tags: string[] | undefined;
	try {
		tags = (JSON.parse(stringTags) as Tag[])
			.map((tag) => tag.name)
			.filter((n) => Tags.find((t) => t.name === n));
	} catch (error) {
		tags = undefined;
	}

	const schematic = Schematic.decode(text);
	const { powerBalance, powerConsumption, powerProduction, requirements } = schematic;
	const data = await schematic.toImageBuffer();
	const mimetype = "image/png";

	schematic.name = name;
	schematic.description = description;

	text = schematic.encode();

	const changedSchematic = {
		name,
		creator: creator,
		tags: tags,
		text,
		description,
		encoding_version: schematic.version,
		powerBalance,
		powerConsumption,
		powerProduction,
		requirements,
		image: {
			Data: data,
			ContentType: mimetype,
		},
	};

	const schematicChange = {
		id: originalSchematic._id,
		Changed: changedSchematic,
		Description: cDescription,
	};

	await new SchematicChangeSchema(schematicChange).save();
	return {
		status: 200,
		headers: {
			location: `/schematics/${originalSchematic._id}`,
		},
		body: "",
	};
};

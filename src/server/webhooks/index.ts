import env from "../env";
import { DiscordWebhookHandler } from "./discord";

interface Event {
	triggeredAt: number;
}

interface SchematicEvent extends Event {
	schematicId: string | null;
	schematicName: string | null;
}

interface CreateSchematicEvent extends SchematicEvent {}

interface DeleteSchematicEvent extends SchematicEvent {
	reason: string;
}

interface EditSchematicEvent extends SchematicEvent {
	changes: string;
}

const colors = new Map();
colors.set("red", 0xff0000);
colors.set("yellow", 0xffd000);
colors.set("green", 0x1eff00);

export class EventHandler {
	constructor(webhookHandler: DiscordWebhookHandler, websiteURL: string) {
		this.webhookHandler = webhookHandler;
		this.websiteURL = websiteURL;
		this.events = [];
	}

	webhookHandler: DiscordWebhookHandler;
	websiteURL: string;
	readonly events: Event[];

	createSchematic(event: CreateSchematicEvent): void {
		this.webhookHandler.sendEmbed({
			color: colors.get("green"),
			title: `New Schematic: ${event.schematicName}`,
			url: `${this.websiteURL}/schematics/${event.schematicId}`,
			image: {
				url: `${this.websiteURL}/raw/schematics/${event.schematicId}/image`,
			},
		});
	}

	editSchematic(event: EditSchematicEvent): void {
		this.webhookHandler.sendEmbed({
			color: colors.get("yellow"),
			title: `Changed: ${event.schematicName}`,
			description: event.changes,
			url: `${this.websiteURL}/schematics/${event.schematicId}`,
			image: {
				url: `${this.websiteURL}/raw/schematics/${event.schematicId}/image`,
			},
		});
	}

	deleteSchematic(event: DeleteSchematicEvent): void {
		this.webhookHandler.sendEmbed({
			color: colors.get("red"),
			title: `Deleted: ${event.schematicName}`,
			description: event.reason,
			url: `${this.websiteURL}/schematics/${event.schematicId}`,
			image: {
				url: `${this.websiteURL}/raw/schematics/${event.schematicId}/image`,
			},
		});
	}
}
const discordHandler = new DiscordWebhookHandler(env.WEBHOOK_URL as string);
const webhooks = new EventHandler(discordHandler, env.WEBSITE_URL as string);
export default webhooks;

import { DiscordWebhookHandler } from "./discord_webhook_handler"

interface Event {
  triggeredAt: number
}

interface SchematicEvent extends Event{
  schematicId: string;
  schematicName: string;
}

interface CreateSchematicEvent extends SchematicEvent{

}

interface DeleteSchematicEvent extends SchematicEvent{
  reason: string;
}

interface EditSchematicEvent extends SchematicEvent{
  changes: string;
}

const colors = new Map();
colors.set('red', fromHex("#ff0000"));
colors.set('yellow', fromHex("#ffd000"));
colors.set('green', fromHex("#1eff00"));

export class EventHandler {
  constructor(webhookHandler: DiscordWebhookHandler, websiteURL: string){
    this.webhookHandler = webhookHandler
    this.websiteURL = websiteURL
    this.events = []
  }
  
  webhookHandler: DiscordWebhookHandler
  websiteURL: string
  readonly events: Event[]
  
  createSchematic(event: CreateSchematicEvent){
    this.webhookHandler.sendEmbed({
      color: colors.get('green'),
      title: `New Schematic: ${event.schematicName}`,
      url: `${this.websiteURL}/schematics/${event.schematicId}`
    })
  }
  
  editSchematic(event: EditSchematicEvent){
    this.webhookHandler.sendEmbed({
      color: colors.get('yellow'),
      title: `Changed: ${event.schematicName}`,
      description: event.changes,
      url: `${this.websiteURL}/schematics/${event.schematicId}`
    })
  }
  
  deleteSchematic(event: DeleteSchematicEvent){
    this.webhookHandler.sendEmbed({
      color: colors.get('red'),
      title: `Deleted: ${event.schematicName}`,
      description: event.reason,
      url: `${this.websiteURL}/schematics/${event.schematicId}`
    })
  }
}

function fromHex(hexString: string):number {
  let text = hexString
  if (hexString.startsWith('#')) {
    text = text.slice(1)
  }
  return parseInt(text, 16)
}
import { DiscordWebhookHandler } from "./discord_webhook_handler"

interface Event {
  triggeredAt: string
}

interface SchematicEvent extends Event{
  schematicId: string;
  schematicName: string;
  schematicDescription: string;
}

interface CreateSchematicEvent extends SchematicEvent{

}

interface DeleteSchematicEvent extends SchematicEvent{
  reason: string;
}

interface EditSchematicEvent extends SchematicEvent{
  changes: string;
}

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
      color: "green",
      title: `New Schematic: ${event.schematicName}`,
      url: `${this.websiteURL}/schematics/${event.schematicId}`
    })
  }
  
  editSchematic(event: EditSchematicEvent){
    this.webhookHandler.sendEmbed({
      color: "yellow",
      title: `Changed: ${event.schematicName}`,
      description: event.changes,
      url: `${this.websiteURL}/schematics/${event.schematicId}`
    })
  }
  
  deleteSchematic(event: DeleteSchematicEvent){
    this.webhookHandler.sendEmbed({
      color: "red",
      title: `Deleted: ${event.schematicName}`,
      description: event.reason,
      url: `${this.websiteURL}/schematics/${event.schematicId}`
    })
  }
}
import fetch from 'node-fetch';

interface DiscordWebhookEmbedImage {
  url: string;
}

interface DiscordWebhookEmbed {
  title?: string;
  url?: string;
  description?: string;
  color?: string;
  image?: DiscordWebhookEmbedImage;
}

interface DiscordWebhookBody {
  username?: string;
  avatar_url?: string;
  content?: string;
  embeds?: DiscordWebhookEmbed[];
}

interface DiscordWebhookRequestHeader {
  "Content-Type"?: string
}

interface DiscordWebhookRequest {
  method: string;
  header?: DiscordWebhookRequestHeader;
  body: string | DiscordWebhookBody;
}

export class DiscordWebhookHandler {
  constructor(url: string){
    this.url = url
  }
  
  readonly url: string
  
  send(body: DiscordWebhookBody): number {
  
    let header: DiscordWebhookRequestHeader = {
      "Content-Type": "application/json"
    }
    
    let data: DiscordWebhookRequest = { 
      method: "POST", 
      header,
      body: JSON.stringify(body),
    }

    console.log(data)
    
    fetch(this.url, data)
      .then(r => r.json())
      .then(d => {
        console.log(d)
      })
    
    return 200
  }
  
  sendMessage(message: string): number {
    let body: DiscordWebhookBody = {
      content: message
    }
    
    return this.send(body)
  }
  
  sendEmbed(embed: DiscordWebhookEmbed): number {
    let body: DiscordWebhookBody = {
      embeds: [ embed ]
    }
    
    return this.send(body)
  }
}
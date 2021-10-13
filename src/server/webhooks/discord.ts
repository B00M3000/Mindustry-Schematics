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
  // eslint-disable-next-line camelcase
  avatar_url?: string;
  content?: string;
  embeds?: DiscordWebhookEmbed[];
}

interface DiscordWebhookRequestHeaders {
  'Content-Type'?: string;
}

interface DiscordWebhookRequest {
  method: string;
  headers?: DiscordWebhookRequestHeaders;
  body: string;
}

export class DiscordWebhookHandler {
  constructor(privateUrl: string, publicUrl: string) {
    this.privateUrl = privateUrl;
    this.publicUrl = publicUrl;
  }

  readonly privateUrl: string;
  readonly publicUrl: string;

  send(body: DiscordWebhookBody, isPrivate: boolean): number {
    const headers: DiscordWebhookRequestHeaders = {
      'Content-Type': 'application/json',
    };

    const data: DiscordWebhookRequest = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    };

    fetch(isPrivate ? this.privateUrl : this.publicUrl, data as never);

    return 200;
  }

  sendMessage(message: string, isPrivate: boolean): number {
    const body: DiscordWebhookBody = {
      content: message,
    };

    return this.send(body, isPrivate);
  }

  sendEmbed(embed: DiscordWebhookEmbed, isPrivate: boolean): number {
    const body: DiscordWebhookBody = {
      embeds: [embed],
    };

    return this.send(body, isPrivate);
  }
}

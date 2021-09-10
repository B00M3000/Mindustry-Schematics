// import fetch from 'node-fetch';

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
  constructor(url: string) {
    this.url = url;
  }

  readonly url: string;

  send(body: DiscordWebhookBody): number {
    const headers: DiscordWebhookRequestHeaders = {
      'Content-Type': 'application/json',
    };

    const data: DiscordWebhookRequest = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    };

    fetch(this.url, data as never);

    return 200;
  }

  sendMessage(message: string): number {
    const body: DiscordWebhookBody = {
      content: message,
    };

    return this.send(body);
  }

  sendEmbed(embed: DiscordWebhookEmbed): number {
    const body: DiscordWebhookBody = {
      embeds: [embed],
    };

    return this.send(body);
  }
}

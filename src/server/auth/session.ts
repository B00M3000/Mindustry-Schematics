import { SessionSchema } from '@/server/mongo';

interface SessionOptions {
  session_id: string;
  user_id?: string;
}

export class ServerSession {
  session_id: string;
  user_id?: string;

  constructor(options: SessionOptions) {
    ({ session_id: this.session_id, user_id: this.user_id } = options);
  }

  static async get(session_id?: string): Promise<ServerSession | undefined> {
    if (!session_id) return;
    const sessionDoc = await SessionSchema.findOne({
      _id: session_id,
    });
    if (!sessionDoc) return;
    const session = new ServerSession({
      session_id,
      user_id: sessionDoc.user_id,
    });
    return session;
  }
}

import { SessionSchema } from '@/server/mongo';
import { UserAccess, accessLevels } from '@/lib/auth/access';

interface SessionOptions {
  session_id: string;
  user_id?: string;
}

export class Session {
  session_id: string;
  user_id: string;

  constructor(options: SessionOptions) {
    ({ session_id: this.session_id } = options);
  }

  static async get(session_id?: string): Promise<Session | undefined> {
    if (!session_id) return;
    const sessionDoc = await SessionSchema.findOne({
      id: session_id,
    });
    if (!sessionDoc) return;
    const session = new Session({
      session_id,
      user_id: sessionDoc.user_id
    });
    return session;
  }
}

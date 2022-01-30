import { SessionSchema } from '@/server/mongo';
import { User } from './user';

interface SessionOptions {
  id: string;
  user: User;
}

export class ServerSession {
  id: string;
  user: User;

  constructor(options: SessionOptions) {
    ({ id: this.id, user: this.user } = options);
  }

  static async get(id?: string): Promise<ServerSession | undefined> {
    if (!id) return;
    const sessionDoc = await SessionSchema.findOne({
      _id: id,
    });
    if (!sessionDoc) return;

    const user = await User.get(sessionDoc.user_id);
    if (!user) throw new Error('Cannot have a session without a user');

    const session = new ServerSession({
      id,
      user,
    });
    return session;
  }
}

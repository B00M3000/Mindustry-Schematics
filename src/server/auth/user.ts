import { UserSchema } from '@/server/mongo';
import { UserAccess } from '@/lib/auth/access';

interface UserOptions {
  access: UserAccess | string;
  id: string;
  name: string;
  avatar: string;
}
export class User {
  avatar: string;
  access: UserAccess;
  id: string;
  name: string;

  constructor(options: UserOptions) {
    ({ id: this.id, name: this.name, avatar: this.avatar } = options);

    if (typeof options.access === 'string') {
      this.access = UserAccess.from(options.access);
    } else {
      this.access = options.access;
    }
  }

  static async get(id?: string): Promise<User | undefined> {
    if (!id) return;
    const userDoc = await UserSchema.findOne({
      _id: id,
    });
    if (!userDoc) return;
    const user = new User({
      name: userDoc.username,
      access: UserAccess.from(userDoc.access),
      id,
      avatar: userDoc.avatar,
    });
    return user;
  }
}

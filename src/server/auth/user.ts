import { UserSchema } from '@/server/mongo';
import { UserAccess } from '@/lib/auth/access';

interface UserOptions {
  access: UserAccess | string;
  _id: string;
  name: string;
  avatar: string;
}
export class User {
  avatar: string;
  access: UserAccess;
  _id: string;
  name: string;

  constructor(options: UserOptions) {
    ({ _id: this._id, name: this.name, avatar: this.avatar } = options);

    if (typeof options.access === 'string') {
      this.access = UserAccess.from(options.access);
    } else {
      this.access = options.access;
    }
  }

  static async get(_id?: string): Promise<User | undefined> {
    if (!_id) return;
    const userDoc = await UserSchema.findOne({
      _id,
    });
    if (!userDoc) return;
    const user = new User({
      name: userDoc.username,
      access: UserAccess.from(userDoc.access),
      _id,
      avatar: userDoc.avatar,
    });
    return user;
  }
}

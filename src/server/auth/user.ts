import { UserSchema } from '@/server/mongo';
import { UserAccess, accessLevels } from '@/lib/auth/access';

interface UserOptions {
  access: UserAccess | string;
  _id: string;
  username: string;
  avatar: string;
}
export class User {
  avatar: string;
  access: UserAccess;
  _id: string;
  username: string;

  constructor(options: UserOptions) {
    ({ _id: this._id, username: this.username, avatar: this.avatar } = options);

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
      username: userDoc.username,
      access: UserAccess.from(userDoc.access),
      _id,
      avatar: userDoc.avatar,
    });
    return user;
  }

  /**
   *
   * @deprecated This method should not be used, consider using the new permission check as the following
   * @example  user.access.can({ schematics: Access.readAll | Access.updateAll })
   * @param user
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static levels(user: User | undefined) {
    return {
      isAdmin: user ? user.access >= accessLevels.admin : false,
      isMod: user ? user.access >= accessLevels.mod : false,
    };
  }
}

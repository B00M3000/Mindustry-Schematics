import { UserSchema } from '@/server/mongo';
import { UserAccess, accessLevels } from '@/lib/auth/access';

interface UserOptions {
  access: UserAccess | string;
  uid: string;
  name: string;
}
export class User {
  access: UserAccess;
  uid: string;
  name: string;

  constructor(options: UserOptions) {
    ({ uid: this.uid, name: this.name } = options);

    if (typeof options.access === 'string') {
      this.access = UserAccess.from(options.access);
    } else {
      this.access = options.access;
    }
  }

  static async get(uid?: string): Promise<User | undefined> {
    if (!uid) return;
    const userDoc = await UserSchema.findOne({
      id: uid,
    });
    if (!userDoc) return;
    const user = new User({
      name: userDoc.username,
      access: accessLevels.none,
      uid,
    });
    return user;
  }

  /**
   *
   * @deprecated This method should not be used, consider using the new permission check as the following
   * @example  user.access.can({schematics: { read: 'all', update: 'all' }})
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

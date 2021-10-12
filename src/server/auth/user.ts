import { UserTokenSchema } from '@/server/mongo';
import { UserAccess, accessLevels } from '@/lib/auth/access';

interface UserOptions {
  access: UserAccess | string;
  token: string;
  name: string;
}
export class User {
  access: UserAccess;
  token: string;
  name: string;

  constructor(options: UserOptions) {
    ({ token: this.token, name: this.name } = options);

    if (typeof options.access === 'string') {
      this.access = UserAccess.from(options.access);
    } else {
      this.access = options.access;
    }
  }

  static async get(token?: string): Promise<User | undefined> {
    if (!token) return;
    const userDoc = await UserTokenSchema.findOne({
      token: String(token),
    });
    if (!userDoc) return;
    const user = new User({
      name: userDoc.username,
      access: userDoc.access,
      token: userDoc.token,
    });
    return user;
  }

  /**
   *
   * @deprecated This method should not be used, consider using the new permission check as the following
<<<<<<< HEAD
   * @example  user.access.can({schematics: { read: 'all', update: 'all' }})
=======
   * @example  user.access.can({ schematics: Access.readAll | Access.updateAll })
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
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

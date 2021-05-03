import { UserTokenSchema } from '../mongo';
import { UserAccess, accessLevels } from './access';

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
    if (typeof options.access === 'string') this.access = UserAccess.from(options.access);
    else this.access = options.access;
  }

  static async get(token?: string): Promise<User | undefined> {
    if (!token) return;
    const userDoc = await UserTokenSchema.findOne({
      token,
    });
    if (!userDoc) return;
    const user = new User({
      name: userDoc.username,
      access: userDoc.access,
      token: userDoc.token,
    });
    return user;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static levels(user: User | undefined) {
    return {
      isAdmin: user ? user.access >= accessLevels.admin : false,
      isMod: user ? user.access >= accessLevels.mod : false,
    };
  }
}

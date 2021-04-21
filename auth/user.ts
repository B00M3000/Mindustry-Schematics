import { UserAccess } from './roles';

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
    if (typeof options.access === 'string')
      this.access = UserAccess.from(options.access);
    else this.access = options.access;
  }
}

import { UserRole } from './roles';

interface UserOptions {
  role: UserRole | string;
  token: string;
  name: string;
}
export class User {
  role: UserRole;
  token: string;
  name: string;
  constructor(options: UserOptions) {
    ({ token: this.token, name: this.name } = options);
    if (typeof options.role === 'string') {
      this.role = UserRole.from(options.role);
    } else this.role = options.role;
  }
}

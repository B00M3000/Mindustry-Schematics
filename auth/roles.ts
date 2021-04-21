export class UserAccess {
  readonly name: string;
  readonly level: number;
  constructor(name: string, level: number) {
    this.name = name;
    this.level = level;
  }

  static from(name: string): UserAccess {
    if (name in roles) return roles[name as keyof typeof roles];
    throw new Error('The role is not defined');
  }

  /** This adds support for the operators `>`, `>=`, `<`, and `<=`
   * */
  valueOf() {
    return this.level * -1;
  }

  toString() {
    return this.name;
  }
}
// the names must be camelCase
// the lower the level of the role, the higher its privileges
export const roles = {
  admin: new UserAccess('admin', 0),
  mod: new UserAccess('mod', 1),
  user: new UserAccess('user', 2),
};

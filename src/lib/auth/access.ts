/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export type Resource = 'schematics' | 'userTokens';
export type Action = 'create' | 'read' | 'update' | 'delete';
type Permission = {
  [R in Resource]?: Set<Action>;
};
type PermissionData = {
  [R in Resource]?: Action[];
};
export class UserAccess {
  readonly name: string;
  private readonly permissions: Permission = {};
  constructor({
    name,
    permissions,
    extend,
  }: {
    name: string;
    permissions: {
      [R in Resource]?: Action[];
    };
    extend?: UserAccess;
  }) {
    this.name = name;
    if (extend) {
      this.permissions = {
        ...extend.permissions,
      };
    }
    for (const r in permissions) {
      const resource = r as Resource;
      if (!this.permissions[resource]) {
        this.permissions[resource] = new Set(permissions[resource]);
      } else {
        for (const action of permissions[resource] as Action[]) {
          (this.permissions[resource] as Set<Action>).add(action);
        }
      }
    }
  }

  static from(name: string | undefined): UserAccess {
    // eslint-disable-next-line no-prototype-builtins
    if (name && accessLevels.hasOwnProperty(name))
      return accessLevels[name as keyof typeof accessLevels];
    return accessLevels.none;
  }

  /**
   * Checks if a user with this access level can execute a given set of activities
   * @param permissions The activities to check
   * @returns
   */
  can(permissions: PermissionData): boolean {
    console.log(this.permissions);
    // to speed things up
    if (this.name == accessLevels.none.name) return false;
    for (const r in permissions) {
      const resource = r as Resource;
      for (const a of permissions[resource] as Action[]) {
        const action = a as Action;
        if (!this.permissions[resource]?.has(action)) {
          console.log(this.permissions[resource], action);
          return false;
        }
      }
    }
    return true;
  }

  toString(): string {
    return this.name;
  }

  toJSON(): string {
    return this.name;
  }
}
// the names must be camelCase
// the lower the level of the role, the higher its privileges
export const accessLevels = {
  get admin() {
    return new UserAccess({
      name: 'admin',
      extend: this.mod,
      permissions: {
        userTokens: ['create', 'delete', 'read', 'update'],
      },
    });
  },
  get mod() {
    return new UserAccess({
      name: 'mod',
      permissions: {
        schematics: ['create', 'delete', 'read', 'update'],
      },
    });
  },
  get verifiedUser() {
    return new UserAccess({
      name: 'verifiedUser',
      permissions: {},
    });
  },
  get user() {
    return new UserAccess({
      name: 'user',
      permissions: {},
    });
  },
  // represents a basic user with no permissions besides the universal ones
  get none() {
    return new UserAccess({
      name: 'verifiedUser',
      permissions: {},
    });
  },
};

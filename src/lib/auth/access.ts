/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export type Resource = 'schematics' | 'userTokens';
export type ResourceControl = 'own' | 'all';
export type Action = 'create' | 'read' | 'update' | 'delete';
type Permission = {
  [R in Resource]?: {
    [A in Action]?: ResourceControl;
  };
};
type PermissionData = {
  [R in Resource]?: {
    [A in Action]?: ResourceControl;
  };
};
/** Compares both `a` and `b` and returns a boolean value
 *  representing whether `a` has more control than `b`
 */
function isControlGreaterThan(a: ResourceControl, b: ResourceControl) {
  const controls: ResourceControl[] = ['all', 'own'];
  return controls.indexOf(a) <= controls.indexOf(b);
}
export class UserAccess {
  readonly name: string;
  private readonly permissions: Permission = {};
  constructor({
    name,
    permissions,
    extend,
  }: {
    name: string;
    permissions: PermissionData;
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
        this.permissions[resource] = { ...permissions[resource] };
      } else {
        for (const a in permissions[resource]) {
          const action = a as Action;
          // @ts-ignore
          this.permissions[resource][action] = permissions[resource][action];
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
    // to speed things up
    if (this.name == accessLevels.none.name) return false;
    for (const r in permissions) {
      const resource = r as Resource;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const a in permissions[resource]!) {
        const action = a as Action;
        const access = this.permissions[resource]?.[action];
        if (!access) return false;
        if (!isControlGreaterThan(access, permissions[resource]?.[action] ?? 'own'))
          return false;
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
        userTokens: {
          create: 'all',
          delete: 'all',
          read: 'all',
          update: 'all',
        },
      },
    });
  },
  get mod() {
    return new UserAccess({
      name: 'mod',
      permissions: {
        schematics: {
          create: 'all',
          delete: 'all',
          read: 'all',
          update: 'all',
        },
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

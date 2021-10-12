/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
<<<<<<< HEAD
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
=======
import { hasBitFlag } from '../bit';

export type Resource = 'schematics' | 'userTokens';

/**
 * Bitflags enum, defines actions that an user can execute on a resource
 */
export enum Access {
  createOwn = 1 << 0,
  createAll = createOwn | (1 << 1),

  readOwn = 1 << 2,
  readAll = readOwn | (1 << 3),

  updateOwn = 1 << 4,
  updateAll = updateOwn | (1 << 5),

  deleteOwn = 1 << 6,
  deleteAll = deleteOwn | (1 << 7),

  /** Can Create Read Update and Delete all resources */
  crudAll = createAll | deleteAll | readAll | updateAll,
  /** Can Create Read Update and Delete own resources */
  crudOwn = createOwn | deleteOwn | readOwn | updateOwn,
}

type Permission = {
  [R in Resource]?: Access;
};

type PermissionData = {
  [R in Resource]?: Access;
};

>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
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
<<<<<<< HEAD
      if (!this.permissions[resource]) {
        this.permissions[resource] = { ...permissions[resource] };
      } else {
        for (const a in permissions[resource]) {
          const action = a as Action;
          // @ts-ignore
          this.permissions[resource][action] = permissions[resource][action];
        }
      }
=======
      if (!this.permissions[resource]) this.permissions[resource] = 0;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.permissions[resource]! |= permissions[resource]!;
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
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
<<<<<<< HEAD
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const a in permissions[resource]!) {
        const action = a as Action;
        const access = this.permissions[resource]?.[action];
        if (!access) return false;
        if (!isControlGreaterThan(access, permissions[resource]?.[action] ?? 'own'))
          return false;
      }
=======
      const access = this.permissions[resource];
      const requested = permissions[resource];
      if (!(access && requested) || !hasBitFlag(access, requested)) return false;
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
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
<<<<<<< HEAD
        userTokens: {
          create: 'all',
          delete: 'all',
          read: 'all',
          update: 'all',
        },
=======
        userTokens: Access.crudAll,
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
      },
    });
  },
  get mod() {
    return new UserAccess({
      name: 'mod',
      permissions: {
<<<<<<< HEAD
        schematics: {
          create: 'all',
          delete: 'all',
          read: 'all',
          update: 'all',
        },
=======
        schematics: Access.crudAll,
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
      },
    });
  },
  get verifiedUser() {
    return new UserAccess({
      name: 'verifiedUser',
      permissions: {
<<<<<<< HEAD
        schematics: {
          read: 'all',
          create: 'own',
          delete: 'own',
          update: 'own',
        },
=======
        schematics: Access.crudOwn | Access.readAll,
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
      },
    });
  },
  get user() {
    return new UserAccess({
      name: 'user',
      permissions: {
<<<<<<< HEAD
        schematics: {
          read: 'all',
          create: 'own',
          delete: 'own',
          update: 'own',
        },
=======
        schematics: Access.crudOwn | Access.readAll,
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
      },
    });
  },
  // represents a basic user with no permissions besides the universal ones
  get none() {
    return new UserAccess({
      name: 'none',
      permissions: {
<<<<<<< HEAD
        schematics: {
          read: 'all',
          create: 'own',
        },
=======
        schematics: Access.readAll | Access.createOwn,
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
      },
    });
  },
};

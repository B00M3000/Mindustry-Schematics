/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
      if (!this.permissions[resource]) this.permissions[resource] = 0 as Access;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.permissions[resource]! |= permissions[resource]!;
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
      const access = this.permissions[resource];
      const requested = permissions[resource];
      if (!(access && requested) || !hasBitFlag(access, requested)) return false;
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
        userTokens: Access.crudAll,
      },
    });
  },
  get mod() {
    return new UserAccess({
      name: 'mod',
      permissions: {
        schematics: Access.crudAll,
      },
    });
  },
  get verifiedUser() {
    return new UserAccess({
      name: 'verifiedUser',
      permissions: {
        schematics: Access.crudOwn | Access.readAll,
      },
    });
  },
  get user() {
    return new UserAccess({
      name: 'user',
      permissions: {
        schematics: Access.crudOwn | Access.readAll,
      },
    });
  },
  // represents a basic user with no permissions besides the universal ones
  get none() {
    return new UserAccess({
      name: 'none',
      permissions: {
        schematics: Access.readAll | Access.createOwn,
      },
    });
  },
};

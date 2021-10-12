/* eslint-disable @typescript-eslint/ban-types */

<<<<<<< HEAD
type Primitive = number | string | boolean | null | undefined | symbol | bigint;
type Serializable<R = unknown> = { toJSON(): R };
type ValidKey<T, K extends keyof T> = K extends string | number
  ? T[K] extends Function
    ? never
    : K
  : never;
export type Serialized<T> = T extends Primitive
=======
type ValidKey<T, K extends keyof T> = K extends string
  ? T[K] extends Function | symbol | bigint | undefined
    ? never
    : K
  : never;
export type Serialized<T> = T extends number | string | boolean | null
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
  ? T
  : T extends (infer R)[]
  ? Serialized<R>[]
  : T extends Map<infer K, infer R>
<<<<<<< HEAD
  ? K extends string | number
    ? Record<K, Serialized<R>>
    : {}
  : T extends Map<number, infer R>
  ? Record<number, Serialized<R>>
  : T extends Serializable<infer R>
=======
  ? K extends string
    ? Record<string, Serialized<R>>
    : {}
  : T extends { toJSON(...args: unknown[]): infer R }
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
  ? Serialized<R>
  : {
      [K in keyof T as ValidKey<T, K>]: Serialized<T[K]>;
    };

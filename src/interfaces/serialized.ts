/* eslint-disable @typescript-eslint/ban-types */

type Primitive = number | string | boolean | null | undefined | symbol | bigint;
type Serializable<R = unknown> = { toJSON(): R };
type ValidKey<T, K extends keyof T> = K extends string | number
  ? T[K] extends Function
    ? never
    : K
  : never;
export type Serialized<T> = T extends Primitive
  ? T
  : T extends (infer R)[]
  ? Serialized<R>[]
  : T extends Map<infer K, infer R>
  ? K extends string | number
    ? Record<K, Serialized<R>>
    : {}
  : T extends Map<number, infer R>
  ? Record<number, Serialized<R>>
  : T extends Serializable<infer R>
  ? Serialized<R>
  : {
      [K in keyof T as ValidKey<T, K>]: Serialized<T[K]>;
    };

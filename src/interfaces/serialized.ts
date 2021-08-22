/* eslint-disable @typescript-eslint/ban-types */

type ValidKey<T, K extends keyof T> = K extends string
  ? T[K] extends Function | symbol | bigint | undefined
    ? never
    : K
  : never;
export type Serialized<T> = T extends number | string | boolean | null
  ? T
  : T extends (infer R)[]
  ? Serialized<R>[]
  : T extends Map<infer K, infer R>
  ? K extends string
    ? Record<string, Serialized<R>>
    : {}
  : T extends { toJSON(...args: unknown[]): infer R }
  ? Serialized<R>
  : {
      [K in keyof T as ValidKey<T, K>]: Serialized<T[K]>;
    };

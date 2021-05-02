type Primitive = number | string | boolean | null;
type Serializable<R = unknown> = { toJSON(): R };
type Func = (...args: unknown[]) => unknown;
export type Serialized<T> = T extends Primitive
	? T
	: T extends (infer R)[]
	? Serialized<R>[]
	: T extends Map<string, infer R>
	? Record<string, R>
	: T extends Serializable<infer R>
	? Serialized<R>
	: {
			[K in keyof T as T[K] extends Func ? never : K]: Serialized<T[K]>;
	  };

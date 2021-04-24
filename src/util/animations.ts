type AnimationFunction<T = any> = (
  // eslint-disable-next-line no-undef
  node: Element,
  options: T
) => {
  delay?: number;
  duration?: number;
  easing?: (p: number) => number;
  css?: (t: number, u: number) => string;
  tick?: (t: number, u: number) => any;
};
export const dropIn: AnimationFunction = (node) => {
  return {};
};

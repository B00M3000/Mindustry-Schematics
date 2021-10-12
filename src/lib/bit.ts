export function hasBitFlag(value: number, flag: number): boolean {
  return (value & flag) === flag;
}

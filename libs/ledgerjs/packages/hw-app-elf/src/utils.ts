import bippath from "bip32-path";

export function pathStringToArray(path: string): number[] {
  return bippath.fromString(path).toPathArray();
}

import type { RawCommitsSource } from "./RawCommitsSource";

export interface Inputs {
  token: string;
  map: Set<string>;
  breakingChange: Set<string>;
  sources: Set<RawCommitsSource>;
  replace: boolean;
}

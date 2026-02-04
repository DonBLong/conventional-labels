import type { Inputs } from "@/types/Inputs";
import type { RawCommitsSource } from "@/types/RawCommitsSource";
import { getBooleanInput, getInput, getMultilineInput } from "@actions/core";

export function getInputs(): Inputs {
  const token = getInput("token");
  const map = new Set(getMultilineInput("map"));
  const breakingChange = new Set(getMultilineInput("breaking-change"));
  const sources = new Set(
    getMultilineInput("sources"),
  ) as Set<RawCommitsSource>;
  const replace = getBooleanInput("replace");
  return { token, map, breakingChange, sources, replace };
}

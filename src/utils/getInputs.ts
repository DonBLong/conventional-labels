import { getBooleanInput, getInput, getMultilineInput } from "@actions/core";

export function getInputs() {
  const token = getInput("token");
  const map = getMultilineInput("map");
  const breakingChange = getMultilineInput("breaking-change");
  const sources = getMultilineInput("sources") as ("title and body" | "commits")[];
  const replace = getBooleanInput("replace");
  return { token, map, breakingChange, sources, replace };
}

export type Inputs = ReturnType<typeof getInputs>;

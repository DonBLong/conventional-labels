import type { LabelsMap } from "@/types/LabelsMap";

export function parseLabelsMap(
  inputMap: Set<string>,
  breakingChange?: Set<string>,
): LabelsMap {
  const map = new Map(
    [...inputMap]
      .map(entry => entry.split(":").map(part => part.trim()))
      .map(([prefix, ...labels]) => [
        prefix,
        new Set(
          labels.flatMap(str => str.split(",").map(label => label.trim())),
        ),
      ]),
  );
  if (breakingChange) map.set("breaking-change", breakingChange);
  return map;
}

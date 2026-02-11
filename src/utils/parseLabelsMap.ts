export function parseLabelsMap(inputMap: string[], breakingChange?: string[]) {
  const map = new Map<string, string[]>();
  const inputMapSet = new Set(inputMap);
  for (const entry of inputMapSet) {
    const [prefix, labelsString] = entry
      .split(":")
      .map(part => part.trim())
      .filter(part => part !== "");
    const labels = labelsString
      ?.split(",")
      .map(label => label.trim())
      .filter(label => label !== "");
    if (labels?.length) map.set(prefix, labels);
  }
  if (breakingChange?.length) map.set("breaking-change", breakingChange);
  return map;
}

export type LabelsMap = ReturnType<typeof parseLabelsMap>;

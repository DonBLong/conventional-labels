import type { CommitTypes } from "./parseCommitTypes";
import type { LabelsMap } from "./parseLabelsMap";

export function prepareLabels(labelsMap: LabelsMap, commitTypes: CommitTypes) {
  let labels = new Set<string>();
  for (const type of commitTypes) {
    const typeLabels = labelsMap.get(type);
    if (!typeLabels) continue;
    labels = labels.union(new Set(typeLabels));
  }
  return [...labels];
}

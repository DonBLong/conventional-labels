import type { LabelsMap } from "@/types/LabelsMap";

export function prepareLabels(
  labelsMap: LabelsMap,
  commitTypes: Set<string>,
): string[] {
  return [
    ...new Set(
      [...commitTypes]
        .flatMap(type => {
          const labels = labelsMap.get(type);
          if (labels) return [...labels];
        })
        .filter(label => label != null),
    ),
  ];
}

import { parseLabelsMap } from "@/utils/parseLabelsMap";
import { assert, describe, it } from "vitest";

describe(parseLabelsMap, () => {
  it("works with a single label per prefix", () => {
    const inputMap = new Set([
      "feat: feature",
      "fix: bug fix",
      "docs: documentation",
    ]);
    assert.deepEqual(
      parseLabelsMap(inputMap),
      new Map([
        ["feat", new Set(["feature"])],
        ["fix", new Set(["bug fix"])],
        ["docs", new Set(["documentation"])],
      ]),
    );
  });

  it("works with multiple labels per prefix", () => {
    const inputMap = new Set([
      "feat: enhancement, feature",
      "fix: bug, fix",
      "docs: documentation, chore",
    ]);
    assert.deepEqual(
      parseLabelsMap(inputMap),
      new Map([
        ["feat", new Set(["enhancement", "feature"])],
        ["fix", new Set(["bug", "fix"])],
        ["docs", new Set(["documentation", "chore"])],
      ]),
    );
  });

  it("adds a 'breaking-change' entry on passing the second parameter", () => {
    const inputMap = new Set([
      "feat: enhancement, feature",
      "fix: bug, fix",
      "docs: documentation, chore",
    ]);

    const breakingChange = new Set(["breaking", "major"]);

    assert.deepEqual(
      parseLabelsMap(inputMap, breakingChange),
      new Map([
        ["feat", new Set(["enhancement", "feature"])],
        ["fix", new Set(["bug", "fix"])],
        ["docs", new Set(["documentation", "chore"])],
        ["breaking-change", new Set(["breaking", "major"])],
      ]),
    );
  });
});

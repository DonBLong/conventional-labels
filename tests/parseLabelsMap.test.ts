import { parseLabelsMap } from "@/utils/parseLabelsMap";
import { assert, describe, it } from "vitest";

describe(parseLabelsMap, () => {
  it("works with a single label per prefix", () => {
    const inputMap = ["feat: feature", "fix: bug fix", "docs: documentation"];
    assert.deepEqual(
      parseLabelsMap(inputMap),
      new Map([
        ["feat", ["feature"]],
        ["fix", ["bug fix"]],
        ["docs", ["documentation"]],
      ]),
    );
  });

  it("works with multiple labels per prefix", () => {
    const inputMap = [
      "feat: enhancement, feature",
      "fix: bug, fix",
      "docs: documentation, chore",
    ];
    assert.deepEqual(
      parseLabelsMap(inputMap),
      new Map([
        ["feat", ["enhancement", "feature"]],
        ["fix", ["bug", "fix"]],
        ["docs", ["documentation", "chore"]],
      ]),
    );
  });

  it("adds a 'breaking-change' entry on passing the second parameter", () => {
    const inputMap = [
      "feat: enhancement, feature",
      "fix: bug, fix",
      "docs: documentation, chore",
    ];

    const breakingChange = ["breaking", "major"];

    assert.deepEqual(
      parseLabelsMap(inputMap, breakingChange),
      new Map([
        ["feat", ["enhancement", "feature"]],
        ["fix", ["bug", "fix"]],
        ["docs", ["documentation", "chore"]],
        ["breaking-change", ["breaking", "major"]],
      ]),
    );
  });

  it("ignores entries with no labels", () => {
    const inputMap = ["feat: feature", "fix:    ", "docs: documentation"];
    assert.deepEqual(
      parseLabelsMap(inputMap),
      new Map([
        ["feat", ["feature"]],
        ["docs", ["documentation"]],
      ]),
    );
  });

  it("returns an empty map on no total labels", () => {
    const inputMap = ["feat: ", "fix:    ", "docs:"];
    assert.deepEqual(parseLabelsMap(inputMap), new Map());
  });
});

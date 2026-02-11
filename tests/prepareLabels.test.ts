import { prepareLabels } from "@/utils/prepareLabels";
import { assert, assertType, describe, it } from "vitest";

describe(prepareLabels, () => {
  it("only adds labels that match given commit types", () => {
    const labelsMap = new Map([
      ["feat", ["enhancement"]],
      ["fix", ["bug"]],
      ["docs", ["documentation"]],
    ]);
    const commitTypes = ["feat", "fix"];
    assert.deepEqual(prepareLabels(labelsMap, commitTypes), [
      "enhancement",
      "bug",
    ]);
  });

  it("accumulates all labels into one list", () => {
    const labelsMap = new Map([
      ["feat", ["enhancement", "feature"]],
      ["fix", ["bug", "fix"]],
      ["docs", ["documentation", "chore"]],
    ]);
    const commitTypes = ["feat", "fix", "docs"];
    assert.deepEqual(prepareLabels(labelsMap, commitTypes), [
      "enhancement",
      "feature",
      "bug",
      "fix",
      "documentation",
      "chore",
    ]);
  });

  it("filters out duplicate labels", () => {
    const labelsMap = new Map([
      ["feat", ["enhancement", "feature"]],
      ["perf", ["enhancement", "performance"]],
    ]);
    const commitTypes = ["feat", "perf"];
    assert.deepEqual(prepareLabels(labelsMap, commitTypes), [
      "enhancement",
      "feature",
      "performance",
    ]);
  });

  it("filters out unmapped commit types", () => {
    const labelsMap = new Map([
      ["feat", ["feature"]],
      ["perf", ["performance"]],
    ]);
    const commitTypes = ["feat", "perf", "fix"];
    assert.deepEqual(prepareLabels(labelsMap, commitTypes), [
      "feature",
      "performance",
    ]);
  });

  it("returns an empty Array<string> on zero matches", () => {
    const labelsMap = new Map([
      ["feat", ["feature"]],
      ["perf", ["performance"]],
    ]);
    const commitTypes = ["fix", "docs"];
    assert.deepEqual(prepareLabels(labelsMap, commitTypes), []);
    assertType<string[]>(prepareLabels(labelsMap, commitTypes));
  });
});

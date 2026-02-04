import { prepareLabels } from "@/utils/prepareLabels";
import { assert, assertType, describe, it } from "vitest";

describe(prepareLabels, () => {
  it("only adds labels that match given commit types", () => {
    const labelsMap = new Map([
      ["feat", new Set(["enhancement"])],
      ["fix", new Set(["bug"])],
      ["docs", new Set(["documentation"])],
    ]);
    const commitTypes = new Set(["feat", "fix"]);
    assert.deepEqual(prepareLabels(labelsMap, commitTypes), [
      "enhancement",
      "bug",
    ]);
  });

  it("accumulates all labels into one list", () => {
    const labelsMap = new Map([
      ["feat", new Set(["enhancement", "feature"])],
      ["fix", new Set(["bug", "fix"])],
      ["docs", new Set(["documentation", "chore"])],
    ]);
    const commitTypes = new Set(["feat", "fix", "docs"]);
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
      ["feat", new Set(["enhancement", "feature"])],
      ["perf", new Set(["enhancement", "performance"])],
    ]);
    const commitTypes = new Set(["feat", "perf"]);
    assert.deepEqual(prepareLabels(labelsMap, commitTypes), [
      "enhancement",
      "feature",
      "performance",
    ]);
  });

  it("filters out unmapped commit types", () => {
    const labelsMap = new Map([
      ["feat", new Set(["feature"])],
      ["perf", new Set(["performance"])],
    ]);
    const commitTypes = new Set(["feat", "perf", "fix"]);
    assert.deepEqual(prepareLabels(labelsMap, commitTypes), [
      "feature",
      "performance",
    ]);
  });

  it("returns an empty Array<string> on zero matches", () => {
    const labelsMap = new Map([
      ["feat", new Set(["feature"])],
      ["perf", new Set(["performance"])],
    ]);
    const commitTypes = new Set(["fix", "docs"]);
    assert.deepEqual(prepareLabels(labelsMap, commitTypes), []);
    assertType<string[]>(prepareLabels(labelsMap, commitTypes));
  });
});

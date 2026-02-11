import {
  WARN_EMPTY_MAP,
  WARN_NO_CONVENTIONAL_COMMITS,
  WARN_NO_MATCHED_PREFIXES,
  WARN_NO_RAW_COMMITS,
} from "@/constants/warnings";
import { run, type RunParams } from "@/main";
import type { Inputs } from "@/utils/getInputs";
import { assert, describe, it } from "vitest";

describe(run, () => {
  const defaultInputs: Inputs = {
    token: "github.token",
    map: [
      "feat: enhancement",
      "perf: enhancement",
      "fix: bug",
      "docs: documentation",
    ],
    breakingChange: ["breaking change"],
    sources: ["title and body", "commits"],
    replace: false,
  };
  const currentLabels = [{ name: "question" }, { name: "bug" }];
  const api: Pick<RunParams, "octokit" | "addLabelsAPI" | "setLabelsAPI"> = {
    octokit: undefined,
    addLabelsAPI: async labels => [
      ...currentLabels,
      ...labels.map(label => ({ name: label })),
    ],
    setLabelsAPI: async labels => labels.map(label => ({ name: label })),
  };

  it("returns with warning on invalid input map", async () => {
    const expected = { outputs: { map: {} }, warning: WARN_EMPTY_MAP };

    // Empty input map
    let actual = await run({
      inputs: { ...defaultInputs, map: [], breakingChange: [] },
    });
    assert.deepEqual(actual, expected);

    // Invalid input map
    actual = await run({
      inputs: { ...defaultInputs, map: ["feat feature"], breakingChange: [] },
      listCommitsAPI: async () => ["feat: commit message"],
    });
    assert.deepEqual(actual, expected);
  });

  it("returns with warning on invalid input sources", async () => {
    const expected = {
      outputs: {
        map: { feat: ["feature"], "breaking-change": ["breaking change"] },
        commits: [],
      },
      warning: WARN_NO_RAW_COMMITS,
    };

    // Empty input sources
    let actual = await run({
      inputs: { ...defaultInputs, map: ["feat: feature"], sources: [] },
      listCommitsAPI: async () => ["feat: commit message"],
    });
    assert.deepEqual(actual, expected);

    // Invalid input sources
    actual = await run({
      inputs: {
        ...defaultInputs,
        map: ["feat: feature"],
        // @ts-expect-error
        sources: ["invalid source"],
      },
      listCommitsAPI: async () => ["feat: commit message"],
    });
    assert.deepEqual(actual, expected);
  });

  it("returns with warning on empty or null sources", async () => {
    const expected = {
      outputs: {
        map: { feat: ["feature"], "breaking-change": ["breaking change"] },
        commits: [],
      },
      warning: WARN_NO_RAW_COMMITS,
    };

    // Empty sources
    let actual = await run({
      inputs: {
        ...defaultInputs,
        map: ["feat: feature"],
        sources: ["title and body", "commits"],
      },
      payload: {
        pull_request: { number: 1, title: "", body: "" },
        issue: { number: 1, title: "", body: "" },
      },
      listCommitsAPI: async () => [""],
    });
    assert.deepEqual(actual, expected);

    // Null sources
    actual = await run({
      inputs: {
        ...defaultInputs,
        map: ["feat: feature"],
        sources: ["title and body", "commits"],
      },
      listCommitsAPI: async () => [],
    });
    assert.deepEqual(actual, expected);
  });

  it("returns with warning on no conventional commits", async () => {
    const expected = {
      outputs: {
        map: { feat: ["feature"], "breaking-change": ["breaking change"] },
        commits: ["non conventional commit message"],
        types: [],
      },
      warning: WARN_NO_CONVENTIONAL_COMMITS,
    };
    const actual = await run({
      inputs: { ...defaultInputs, map: ["feat: feature"] },
      listCommitsAPI: async () => ["non conventional commit message"],
    });
    assert.deepEqual(actual, expected);
  });

  it("returns with warning on no matched prefixes", async () => {
    const expected = {
      outputs: {
        map: { feat: ["feature"], "breaking-change": ["breaking change"] },
        commits: ["docs: commit message"],
        types: ["docs"],
        labels: [],
      },
      warning: WARN_NO_MATCHED_PREFIXES,
    };
    const actual = await run({
      inputs: { ...defaultInputs, map: ["feat: feature"] },
      listCommitsAPI: async () => ["docs: commit message"],
    });
    assert.deepEqual(actual, expected);
  });

  it("adds to the current labels when replace is false", async () => {
    const expected = {
      outputs: {
        map: { feat: ["feature"], "breaking-change": ["breaking change"] },
        commits: ["feat: commit message"],
        types: ["feat"],
        labels: ["feature"],
        currentLabels: [...currentLabels, { name: "feature" }],
      },
    };
    const actual = await run({
      inputs: { ...defaultInputs, map: ["feat: feature"], replace: false },
      listCommitsAPI: async () => ["feat: commit message"],
      ...api,
    });
    assert.deepEqual(actual, expected);
  });

  it("replaces the current labels when replace is true", async () => {
    const expected = {
      outputs: {
        map: { feat: ["feature"], "breaking-change": ["breaking change"] },
        commits: ["feat: commit message"],
        types: ["feat"],
        labels: ["feature"],
        currentLabels: [{ name: "feature" }],
      },
    };
    const actual = await run({
      inputs: { ...defaultInputs, map: ["feat: feature"], replace: true },
      listCommitsAPI: async () => ["feat: commit message"],
      ...api,
    });
    assert.deepEqual(actual, expected);
  });

  it("parses commits from source's title", async () => {
    const expected = {
      outputs: {
        map: { feat: ["feature"], "breaking-change": ["breaking change"] },
        commits: ["fix: commit message", "feat: commit message"],
        types: ["fix", "feat"],
        labels: ["feature"],
        currentLabels: [...currentLabels, { name: "feature" }],
      },
    };
    const actual = await run({
      inputs: { ...defaultInputs, map: ["feat: feature"] },
      payload: { pull_request: { number: 1, title: "fix: commit message" } },
      listCommitsAPI: async () => ["feat: commit message"],
      ...api,
    });
    assert.deepEqual(actual, expected);
  });

  it("parses commits from source's title and body", async () => {
    const expected = {
      outputs: {
        map: { feat: ["feature"], "breaking-change": ["breaking change"] },
        commits: [
          "fix: commit message\nBREAKING CHANGE: body",
          "feat: commit message",
        ],
        types: ["fix", "breaking-change", "feat"],
        labels: ["breaking change", "feature"],
        currentLabels: [
          ...currentLabels,
          { name: "breaking change" },
          { name: "feature" },
        ],
      },
    };
    const actual = await run({
      inputs: { ...defaultInputs, map: ["feat: feature"] },
      payload: {
        pull_request: {
          number: 1,
          title: "fix: commit message",
          body: "BREAKING CHANGE: body",
        },
      },
      listCommitsAPI: async () => ["feat: commit message"],
      ...api,
    });
    assert.deepEqual(actual, expected);
  });
});

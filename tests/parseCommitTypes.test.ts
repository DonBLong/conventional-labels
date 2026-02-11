import { parseCommitTypes } from "@/utils/parseCommitTypes";
import { assert, describe, it } from "vitest";

describe(parseCommitTypes, () => {
  it("works on messages without scopes", async () => {
    const rawCommits = ["fix: foo", "feat: bar"];
    assert.deepEqual(await parseCommitTypes(rawCommits), ["fix", "feat"]);
  });

  it("works on messages with scopes", async () => {
    const rawCommits = ["fix(scope): foo", "feat(scope): bar"];
    assert.deepEqual(await parseCommitTypes(rawCommits), ["fix", "feat"]);
  });

  it("works with breaking-change patterns", async () => {
    let rawCommits = ["fix!: foo"];
    assert.deepEqual(await parseCommitTypes(rawCommits), [
      "fix",
      "breaking-change",
    ]);

    rawCommits = ["fix(scope)!: foo"];
    assert.deepEqual(await parseCommitTypes(rawCommits), [
      "fix",
      "breaking-change",
    ]);

    rawCommits = ["fix: foo\nbreaking change:"];
    assert.deepEqual(await parseCommitTypes(rawCommits), [
      "fix",
      "breaking-change",
    ]);

    rawCommits = ["fix: foo\nbar\nbreaking change:"];
    assert.deepEqual(await parseCommitTypes(rawCommits), [
      "fix",
      "breaking-change",
    ]);
  });

  it("ignores non-conventional commits", async () => {
    const rawCommits = ["foo bar"];
    assert.deepEqual(await parseCommitTypes(rawCommits), []);
  });
});

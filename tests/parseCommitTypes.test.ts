import { parseCommitTypes } from "@/utils/parseCommitTypes";
import { describe, assert, it } from "vitest";

describe(parseCommitTypes, () => {
  it("works on messages without scopes", async () => {
    const rawCommits = new Set(["fix: foo", "feat: bar"]);
    assert.deepEqual(
      await parseCommitTypes(rawCommits),
      new Set(["fix", "feat"]),
    );
  });

  it("works on messages with scopes", async () => {
    const rawCommits = new Set(["fix(scope): foo", "feat(scope): bar"]);
    assert.deepEqual(
      await parseCommitTypes(rawCommits),
      new Set(["fix", "feat"]),
    );
  });

  it("works with breaking-change patterns", async () => {
    const rawCommits = new Set(["fix!: foo"]);
    assert.deepEqual(
      await parseCommitTypes(rawCommits),
      new Set(["fix", "breaking-change"]),
    );

    rawCommits.clear();
    rawCommits.add("fix(scope)!: foo");
    assert.deepEqual(
      await parseCommitTypes(rawCommits),
      new Set(["fix", "breaking-change"]),
    );

    rawCommits.clear();
    rawCommits.add("fix: foo\nbreaking change:");
    assert.deepEqual(
      await parseCommitTypes(rawCommits),
      new Set(["fix", "breaking-change"]),
    );

    rawCommits.clear();
    rawCommits.add("fix: foo\nbar\nbreaking change:");
    assert.deepEqual(
      await parseCommitTypes(rawCommits),
      new Set(["fix", "breaking-change"]),
    );
  });

  it("ignores non-conventional commits", async () => {
    const rawCommits = new Set(["foo bar"]);
    assert.deepEqual(await parseCommitTypes(rawCommits), new Set([]));
  });
});

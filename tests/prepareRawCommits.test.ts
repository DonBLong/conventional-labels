import { prepareRawCommits } from "@/utils/prepareRawCommits";
import { assert, describe, it } from "vitest";

describe(prepareRawCommits, () => {
  const pull_request = {
    number: 1,
    title: "pull request's title",
    body: "pull request's body",
  };
  const issue = {
    number: 1,
    title: "issue's title",
    body: "issue's body",
  };
  const commits = ["commit message 1", "commit message 2"];

  it("works with pull request's title only", async () => {
    const actual = await prepareRawCommits({
      from: ["title and body"],
      payload: { pull_request: { ...pull_request, body: undefined }, issue },
      listCommitsAPI: async () => commits,
    });
    const expected = [pull_request.title];
    assert.sameMembers([...actual], expected);
  });

  it("works with issue's title only", async () => {
    const actual = await prepareRawCommits({
      from: ["title and body"],
      payload: { issue: { ...issue, body: undefined } },
      listCommitsAPI: async () => commits,
    });
    const expected = [issue.title];
    assert.sameMembers([...actual], expected);
  });

  it("works with pull request's title and body", async () => {
    const actual = await prepareRawCommits({
      from: ["title and body"],
      payload: { pull_request, issue },
      listCommitsAPI: async () => commits,
    });
    const expected = [pull_request.title.concat("\n", pull_request.body)];
    assert.sameMembers([...actual], expected);
  });

  it("works with issue's title and body", async () => {
    const actual = await prepareRawCommits({
      from: ["title and body"],
      payload: { issue },
      listCommitsAPI: async () => commits,
    });
    const expected = [issue.title.concat("\n", issue.body)];
    assert.sameMembers([...actual], expected);
  });

  it("works with commits only", async () => {
    const actual = await prepareRawCommits({
      from: ["commits"],
      payload: { pull_request, issue },
      listCommitsAPI: async () => commits,
    });
    const expected = commits;
    assert.sameMembers([...actual], expected);
  });

  it("works with pull request's title and body + commits", async () => {
    const actual = await prepareRawCommits({
      from: ["title and body", "commits"],
      payload: { pull_request, issue },
      listCommitsAPI: async () => commits,
    });
    const expected = [
      pull_request.title.concat("\n", pull_request.body),
      ...commits,
    ];
    assert.sameMembers([...actual], expected);
  });

  it("ignores empty or null sources", async () => {
    const expected: string[] = [];

    // Empty sources
    let actual = await prepareRawCommits({
      from: ["title and body", "commits"],
      payload: { pull_request: { number: 1 }, issue: { number: 1 } },
      listCommitsAPI: async () => [],
    });
    assert.sameMembers([...actual], expected);

    actual = await prepareRawCommits({
      from: ["title and body", "commits"],
      payload: {
        pull_request: { number: 1, title: "", body: "" },
        issue: { number: 1, title: "", body: "" },
      },
      listCommitsAPI: async () => [""],
    });
    assert.sameMembers([...actual], expected);

    // Null sources
    actual = await prepareRawCommits({
      from: ["title and body", "commits"],
      payload: {},
    });
    assert.sameMembers([...actual], expected);
  });
});

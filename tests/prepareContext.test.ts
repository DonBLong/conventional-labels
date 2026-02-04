import { ERROR_NOT_PULL_REQUEST } from "@/constants/ERROR_NOT_PULL_REQUEST";
import type { ActionContext } from "@/types/ActionContext";
import { prepareContext } from "@/utils/prepareContext";
import { assert, describe, it } from "vitest";

describe(prepareContext, () => {
  it("returns an object containing the owner, the repo and the pull_request of the repository", () => {
    const context: ActionContext = {
      payload: {
        pull_request: { number: 1 },
      },
      repo: { owner: "owner-handle", repo: "repo-handle" },
    };

    assert.deepEqual(prepareContext(context), {
      owner: "owner-handle",
      repo: "repo-handle",
      pull_request: { number: 1 },
    });
  });

  it("extracts owner and repo from payload if found", () => {
    const context: ActionContext = {
      payload: {
        repository: {
          name: "payload-repo",
          owner: {
            login: "payload-owner",
            name: "payload owner name",
          },
        },
        pull_request: { number: 0 },
      },
      repo: { owner: "ctx-owner", repo: "ctx-repo" },
    };

    const preparedContext = prepareContext(context);

    assert.equal(preparedContext.owner, "payload-owner");
    assert.equal(preparedContext.repo, "payload-repo");
  });

  it("extracts owner and repo from context as a fallback", () => {
    const context: ActionContext = {
      payload: {
        pull_request: { number: 0 },
      },
      repo: { owner: "ctx-owner", repo: "ctx-repo" },
    };

    const preparedContext = prepareContext(context);

    assert.equal(preparedContext.owner, "ctx-owner");
    assert.equal(preparedContext.repo, "ctx-repo");
  });

  it("throws if event is not a pull_request", () => {
    const context: ActionContext = {
      payload: {},
      repo: { owner: "ctx-owner", repo: "ctx-repo" },
    };

    assert.throws(() => prepareContext(context), ERROR_NOT_PULL_REQUEST);
  });
});

import type { GithubContext } from "./GithubContext";

export type PullRequest = NonNullable<GithubContext["payload"]["pull_request"]>;

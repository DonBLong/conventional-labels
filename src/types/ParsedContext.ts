import type { Owner } from "./Owner";
import type { PullRequest } from "./PullRequest";
import type { Repo } from "./Repo";

export interface PreparedContext {
  owner: Owner;
  repo: Repo;
  pull_request: PullRequest;
}
0;

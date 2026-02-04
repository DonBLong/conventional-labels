import type { GithubContext } from "./GithubContext";

export interface ActionContext {
  repo: GithubContext["repo"];
  payload: Pick<GithubContext["payload"], "pull_request" | "repository">;
}

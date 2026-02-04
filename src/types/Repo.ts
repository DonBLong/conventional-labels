import type { GithubContext } from "./GithubContext";

export type Repo =
  | NonNullable<GithubContext["payload"]["repository"]>["name"]
  | GithubContext["repo"]["repo"];

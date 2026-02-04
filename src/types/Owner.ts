import type { GithubContext } from "./GithubContext";

export type Owner =
  | NonNullable<GithubContext["payload"]["repository"]>["owner"]["login"]
  | GithubContext["repo"]["owner"];

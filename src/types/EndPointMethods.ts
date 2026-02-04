import type { Octokit } from "./Octokit";

export interface EndPointMethods {
  listCommits: Octokit["rest"]["pulls"]["listCommits"];
  addLabels: Octokit["rest"]["issues"]["addLabels"];
  setLabels: Octokit["rest"]["issues"]["setLabels"];
  removeAllLabels: Octokit["rest"]["issues"]["removeAllLabels"];
}

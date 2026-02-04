import type { Octokit } from "@/types/Octokit";
import type { ResponseData } from "@/types/ResponseData";
import { context } from "@actions/github";

export async function listCommits(
  octokit: Octokit,
): Promise<ResponseData<"listCommits">> {
  const {
    repo,
    issue: { number: pull_number },
  } = context;
  return (await octokit.rest.pulls.listCommits({ pull_number, ...repo })).data;
}

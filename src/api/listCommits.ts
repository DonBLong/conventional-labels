import type { Octokit } from "@/types/Octokit";
import type { PreparedContext } from "@/types/ParsedContext";
import type { ResponseData } from "@/types/ResponseData";

export async function listCommits(
  octokit: Octokit,
  context: PreparedContext,
): Promise<ResponseData<"listCommits">>;

export async function listCommits(
  octokit: Octokit,
  { pull_request: { number: pull_number }, owner, repo }: PreparedContext,
): Promise<ResponseData<"listCommits">> {
  return (await octokit.rest.pulls.listCommits({ pull_number, owner, repo }))
    .data;
}

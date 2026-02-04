import type { Octokit } from "@/types/Octokit";
import type { PreparedContext } from "@/types/ParsedContext";
import type { ResponseData } from "@/types/ResponseData";

export async function setLabels(
  labels: string[],
  octokit: Octokit,
  context: PreparedContext,
): Promise<ResponseData<"setLabels">>;

export async function setLabels(
  labels: string[],
  octokit: Octokit,
  { pull_request: { number: issue_number }, owner, repo }: PreparedContext,
): Promise<ResponseData<"setLabels">> {
  return (
    await octokit.rest.issues.setLabels({
      issue_number,
      labels,
      owner,
      repo,
    })
  ).data;
}

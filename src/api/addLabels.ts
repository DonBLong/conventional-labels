import type { Octokit } from "@/types/Octokit";
import type { PreparedContext } from "@/types/ParsedContext";
import type { ResponseData } from "@/types/ResponseData";

export async function addLabels(
  labels: string[],
  octokit: Octokit,
  context: PreparedContext,
): Promise<ResponseData<"addLabels">>;

export async function addLabels(
  labels: string[],
  octokit: Octokit,
  { pull_request: { number: issue_number }, owner, repo }: PreparedContext,
): Promise<ResponseData<"addLabels">> {
  return (
    await octokit.rest.issues.addLabels({ issue_number, labels, owner, repo })
  ).data;
}

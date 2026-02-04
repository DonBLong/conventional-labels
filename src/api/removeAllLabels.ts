import type { Octokit } from "@/types/Octokit";
import type { PreparedContext } from "@/types/ParsedContext";
import type { ResponseStatusCode } from "@/types/ResponseStatusCode";

export async function removeAllLabels(
  octokit: Octokit,
  context: PreparedContext,
): Promise<ResponseStatusCode<"removeAllLabels">>;

export async function removeAllLabels(
  octokit: Octokit,
  { pull_request: { number: issue_number }, owner, repo }: PreparedContext,
): Promise<ResponseStatusCode<"removeAllLabels">> {
  return (
    await octokit.rest.issues.removeAllLabels({
      issue_number,
      owner,
      repo,
    })
  ).status;
}

import type { Octokit } from "@/types/Octokit";
import type { ResponseStatusCode } from "@/types/ResponseStatusCode";
import { context } from "@actions/github";

export async function removeAllLabels(
  octokit: Octokit,
): Promise<ResponseStatusCode<"removeAllLabels">> {
  const {
    repo,
    issue: { number: issue_number },
  } = context;
  return (
    await octokit.rest.issues.removeAllLabels({
      issue_number,
      ...repo,
    })
  ).status;
}

import type { Octokit } from "@/types/Octokit";
import type { ResponseData } from "@/types/ResponseData";
import { context } from "@actions/github";

export async function setLabels(
  labels: string[],
  octokit: Octokit,
): Promise<ResponseData<"setLabels">> {
  const {
    repo,
    issue: { number: issue_number },
  } = context;
  return (
    await octokit.rest.issues.setLabels({
      labels,
      issue_number,
      ...repo,
    })
  ).data;
}

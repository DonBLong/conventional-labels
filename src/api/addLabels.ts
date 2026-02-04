import type { Octokit } from "@/types/Octokit";
import type { ResponseData } from "@/types/ResponseData";
import { context } from "@actions/github";

export async function addLabels(
  labels: string[],
  octokit: Octokit,
): Promise<ResponseData<"addLabels">> {
  const {
    repo,
    issue: { number: issue_number },
  } = context;
  return (
    await octokit.rest.issues.addLabels({ labels, issue_number, ...repo })
  ).data;
}

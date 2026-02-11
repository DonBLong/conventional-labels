import { context, type getOctokit } from "@actions/github";

export async function addLabels(
  octokit: ReturnType<typeof getOctokit>,
  labels: string[],
) {
  const {
    repo,
    issue: { number: issue_number },
  } = context;
  return (
    await octokit.rest.issues.addLabels({ labels, issue_number, ...repo })
  ).data;
}

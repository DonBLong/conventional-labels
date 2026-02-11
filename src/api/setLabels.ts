import { context, type getOctokit } from "@actions/github";

export async function setLabels(
  octokit: ReturnType<typeof getOctokit>,
  labels: string[],
) {
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

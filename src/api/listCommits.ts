import { context, type getOctokit } from "@actions/github";

export async function listCommits(octokit: ReturnType<typeof getOctokit>) {
  const {
    repo,
    eventName,
    issue: { number: pull_number },
  } = context;
  if (eventName !== "pull_request") return [];
  return (
    await octokit.rest.pulls.listCommits({ pull_number, ...repo })
  ).data.map(({ commit: { message } }) => message);
}

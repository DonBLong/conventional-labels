import { listCommits } from "@/api/listCommits";
import type { Octokit } from "@/types/Octokit";
import type { RawCommitsSource } from "@/types/RawCommitsSource";
import { context } from "@actions/github";

export async function prepareRawCommits(
  sources: Set<RawCommitsSource>,
  octokit: Octokit,
): Promise<Set<string>> {
  const {
    payload: { pull_request, issue },
  } = context;
  const rawCommits: Set<string> = new Set();
  if (sources.has("title")) {
    const title = pull_request?.title || issue?.title;
    if (typeof title === "string") rawCommits.add(title);
  }
  if (sources.has("title and body")) {
    const title = pull_request?.title || issue?.title;
    const body = pull_request?.body || issue?.body;
    if (typeof title === "string") {
      if (body) {
        rawCommits.delete(title);
        rawCommits.add(title.concat("\n", body));
      } else rawCommits.add(title);
    }
  }
  if (sources.has("commits") && pull_request) {
    const commitsData = await listCommits(octokit);
    commitsData.forEach(({ commit: { message } }) => rawCommits.add(message));
  }
  return rawCommits;
}

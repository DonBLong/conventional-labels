import { listCommits } from "@/api/listCommits";
import type { Octokit } from "@/types/Octokit";
import type { PreparedContext } from "@/types/ParsedContext";
import type { RawCommitsSource } from "@/types/RawCommitsSource";

export async function prepareRawCommits(
  sources: Set<RawCommitsSource>,
  octokit: Octokit,
  context: PreparedContext,
): Promise<Set<string>> {
  const rawCommits: Set<string> = new Set();
  if (sources.has("title")) {
    const { title } = context.pull_request;
    if (typeof title === "string") rawCommits.add(title);
  }
  if (sources.has("body")) {
    const { body } = context.pull_request;
    if (body) rawCommits.add(body);
  }
  if (sources.has("commits")) {
    const commitsData = await listCommits(octokit, context);
    commitsData.forEach(({ commit: { message } }) => rawCommits.add(message));
  }
  return rawCommits;
}

import type { context } from "@actions/github";

export async function prepareRawCommits({
  from,
  payload: { pull_request, issue },
  listCommitsAPI,
}: PrepareRawCommitsParams) {
  const rawCommits = new Set<string>();
  if (from.includes("title and body")) {
    const { title, body } = pull_request ?? issue ?? {};
    if (title?.length && body?.length) rawCommits.add(title.concat("\n", body));
    else if (title?.length) rawCommits.add(title);
  }
  if (from.includes("commits") && listCommitsAPI) {
    const messages = await listCommitsAPI();
    for (const message of messages) {
      if (message.length) rawCommits.add(message);
    }
  }
  return [...rawCommits];
}

export interface PrepareRawCommitsParams {
  from: ("title and body" | "commits")[];
  payload: Pick<(typeof context)["payload"], "pull_request" | "issue"> & {
    pull_request?: { title?: string };
    issue?: { title?: string };
  };
  listCommitsAPI?: () => Promise<string[]>;
}

import { ERROR_NOT_PULL_REQUEST } from "@/constants/ERROR_NOT_PULL_REQUEST";
import type { ActionContext } from "@/types/ActionContext";
import type { PreparedContext } from "@/types/ParsedContext";

export function prepareContext(context: ActionContext): PreparedContext {
  const {
    payload: { pull_request, repository },
  } = context;
  if (!pull_request) throw Error(ERROR_NOT_PULL_REQUEST);
  const owner = repository?.owner.login ?? context.repo.owner;
  const repo = repository?.name ?? context.repo.repo;
  return { owner, repo, pull_request };
}

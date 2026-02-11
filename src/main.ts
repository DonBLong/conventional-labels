import { context, getOctokit } from "@actions/github";
import type { Label } from "@octokit/webhooks-types";
import { addLabels } from "./api/addLabels";
import { listCommits } from "./api/listCommits";
import { setLabels } from "./api/setLabels";
import {
  WARN_EMPTY_MAP,
  WARN_NO_CONVENTIONAL_COMMITS,
  WARN_NO_MATCHED_PREFIXES,
  WARN_NO_RAW_COMMITS,
} from "./constants/warnings";
import { getInputs, type Inputs } from "./utils/getInputs";
import { parseCommitTypes } from "./utils/parseCommitTypes";
import { parseLabelsMap } from "./utils/parseLabelsMap";
import { prepareLabels } from "./utils/prepareLabels";
import { prepareRawCommits, type PrepareRawCommitsParams } from "./utils/prepareRawCommits";

export async function run({
  inputs: { token, map, breakingChange, sources, replace } = getInputs(),
  payload = context.payload,
  octokit = getOctokit(token),
  listCommitsAPI = listCommits.bind(null, octokit),
  addLabelsAPI = addLabels.bind(null, octokit),
  setLabelsAPI = setLabels.bind(null, octokit),
}: RunParams = {}) {
  const outputs: Outputs = {};

  const labelsMap = parseLabelsMap(map, breakingChange);
  outputs.map = Object.fromEntries(labelsMap);
  if (!labelsMap.size) return { outputs, warning: WARN_EMPTY_MAP };

  outputs.commits = await prepareRawCommits({ from: sources, payload, listCommitsAPI });
  if (!outputs.commits.length) return { outputs, warning: WARN_NO_RAW_COMMITS };

  outputs.types = await parseCommitTypes(outputs.commits);
  if (!outputs.types.length) {
    return { outputs, warning: WARN_NO_CONVENTIONAL_COMMITS };
  }

  outputs.labels = prepareLabels(labelsMap, outputs.types);
  if (!outputs.labels.length) {
    return { outputs, warning: WARN_NO_MATCHED_PREFIXES };
  }
  outputs.currentLabels = await (replace ? setLabelsAPI : addLabelsAPI)(outputs.labels);
  return { outputs };
}

export interface RunParams extends Partial<Pick<PrepareRawCommitsParams, "payload" | "listCommitsAPI">> {
  inputs?: Inputs;
  octokit?: ReturnType<typeof getOctokit>;
  addLabelsAPI?: (labels: string[]) => Promise<Partial<Label>[]>;
  setLabelsAPI?: (labels: string[]) => Promise<Partial<Label>[]>;
}

export interface Outputs {
  map?: Record<string, string[]>;
  commits?: string[];
  types?: string[];
  labels?: string[];
  currentLabels?: Partial<Label>[];
}

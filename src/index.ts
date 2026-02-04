import { info, setFailed, setOutput, warning } from "@actions/core";
import { getOctokit } from "@actions/github";
import { exit } from "node:process";
import { addLabels } from "./api/addLabels";
import { removeAllLabels } from "./api/removeAllLabels";
import { setLabels } from "./api/setLabels";
import { WARN_EMPTY_MAP } from "./constants/WARN_EMPTY_MAP";
import { WARN_NO_CONVENTIONAL_COMMITS } from "./constants/WARN_NO_CONVENTIOANL_COMMITS";
import { WARN_NO_RAW_COMMITS } from "./constants/WARN_NO_RAW_COMMITS";
import { getInputs } from "./utils/getInputs";
import { parseCommitTypes } from "./utils/parseCommitTypes";
import { parseLabelsMap } from "./utils/parseLabelsMap";
import { prepareLabels } from "./utils/prepareLabels";
import { prepareRawCommits } from "./utils/prepareRawCommits";

try {
  const { token, map, breakingChange, sources, replace } = getInputs();

  const labelsMap = parseLabelsMap(map, breakingChange);
  const labelsMapOutput = [...labelsMap].map(([prefix, labels]) => [
    prefix,
    [...labels],
  ]);
  setOutput("map", Object.fromEntries(labelsMapOutput));
  if (!labelsMap.size) {
    warning(WARN_EMPTY_MAP);
    exit(0);
  }

  const octokit = getOctokit(token);

  const rawCommits = await prepareRawCommits(sources, octokit);
  if (!rawCommits.size) {
    warning(WARN_NO_RAW_COMMITS);
    exit(0);
  }
  const commitTypes = await parseCommitTypes(rawCommits);
  setOutput("types", [...commitTypes]);
  if (!commitTypes.size) {
    warning(WARN_NO_CONVENTIONAL_COMMITS);
    exit(0);
  }

  const labels = prepareLabels(labelsMap, commitTypes);
  setOutput("labels", labels);
  if (labels.length) {
    const labelsData = await (replace ? setLabels : addLabels)(labels, octokit);
    info(`Labels added:\n${JSON.stringify(labelsData, undefined, 1)}`);
  } else if (replace) await removeAllLabels(octokit);
} catch (err) {
  setFailed(err instanceof Error ? err.message : JSON.stringify(err));
}

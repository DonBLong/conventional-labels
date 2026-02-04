import { parseCommits } from "conventional-commits-parser";

export async function parseCommitTypes(
  rawCommits: Set<string>,
): Promise<Set<string>> {
  const commitParser = parseCommits({
    breakingHeaderPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?!\: (.*)$/,
  });
  const commitsGenerator = commitParser(rawCommits);
  const types: Set<string> = new Set();
  for await (const { type, notes } of commitsGenerator) {
    if (type) types.add(type);
    if (notes.length) types.add("breaking-change");
  }
  return types;
}

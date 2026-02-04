import { parseCommits } from "conventional-commits-parser";

export async function parseCommitTypes(
  rawCommits: Set<string>,
): Promise<Set<string>> {
  const commitParser = parseCommits({
    breakingHeaderPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?!\: (.*)$/,
  });
  const commitsGenerator = commitParser(rawCommits);
  const types: Set<string> = new Set();
  for await (const { type, notes, header, body, footer } of commitsGenerator) {
    if (type) types.add(type);
    if (
      notes.length ||
      type?.match(/breaking/gi) ||
      header?.match(/breaking/gi) ||
      body?.match(/breaking/gi) ||
      footer?.match(/breaking/gi)
    )
      types.add("breaking-change");
  }
  return types;
}

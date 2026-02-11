import { parseCommits } from "conventional-commits-parser";

export async function parseCommitTypes(rawCommits: string[]) {
  const commitsGenerator = commitParser(new Set(rawCommits));
  const types = new Set<string>();
  for await (const { type, notes } of commitsGenerator) {
    if (type) types.add(type);
    if (notes.length) types.add("breaking-change");
  }
  return [...types];
}

const commitParser = parseCommits({
  breakingHeaderPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?!\: (.*)$/,
});

export type CommitTypes = Awaited<ReturnType<typeof parseCommitTypes>>;

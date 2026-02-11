import { defineConfig } from "tsdown";

export default defineConfig({
  exports: true,
  entry: "src/index.ts",
  noExternal: [
    "@actions/core",
    "@actions/github",
    "conventional-commits-parser",
  ],
});

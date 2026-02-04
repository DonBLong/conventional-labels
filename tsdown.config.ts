import { defineConfig } from "tsdown";

export default defineConfig({
  exports: true,
  noExternal: [
    "@actions/core",
    "@actions/github",
    "conventional-commits-parser",
  ],
});

import { setFailed, setOutput, warning as warn } from "@actions/core";
import { run } from "./main";

try {
  const { outputs, warning } = await run();
  for (const [name, value] of Object.entries(outputs)) {
    setOutput(name, value);
    console.log(`${name}:`, value);
  }
  if (warning) warn(warning);
} catch (error) {
  if (error instanceof Error) setFailed(error.message);
  else setFailed(String(error));
}

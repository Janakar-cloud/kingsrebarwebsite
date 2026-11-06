// Runs the end-to-end suite against the production build, the review build, or both.
//   node scripts/e2e.mjs                  both, one after the other
//   node scripts/e2e.mjs review           review build only
//   node scripts/e2e.mjs production -g nav   extra arguments go to Playwright
// The builds share `.next`, so they must never run at the same time.
import { spawnSync } from "node:child_process";

const allModes = ["production", "review"];
const [first, ...rest] = process.argv.slice(2);
const modes = allModes.includes(first) ? [first] : allModes;
const extraArgs = allModes.includes(first) ? rest : process.argv.slice(2);
let failed = false;

for (const mode of modes) {
  console.log(`\n=== E2E: ${mode} build ===\n`);
  const result = spawnSync("npx", ["playwright", "test", ...extraArgs], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, E2E_MODE: mode },
  });
  if (result.status !== 0) failed = true;
}

process.exit(failed ? 1 : 0);

/**
 * Module resolution hooks that let Node's built-in test runner import the
 * application's TypeScript sources the way the Next.js bundler does:
 *
 *  - the "@/..." path alias maps to src/
 *  - extensionless relative imports resolve to .ts / .tsx / index.ts
 *  - "server-only" resolves to an empty module
 */
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const serverOnlyStub = new URL("./server-only.mjs", import.meta.url).href;
const extensions = [".ts", ".tsx"];

function locate(base) {
  for (const extension of extensions) {
    if (existsSync(base + extension)) return base + extension;
  }
  if (existsSync(base) && statSync(base).isDirectory()) {
    for (const extension of extensions) {
      const index = path.join(base, `index${extension}`);
      if (existsSync(index)) return index;
    }
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return { url: serverOnlyStub, shortCircuit: true };
  }

  let base = null;
  if (specifier.startsWith("@/")) {
    base = path.join(root, "src", specifier.slice(2));
  } else if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !path.extname(specifier) &&
    context.parentURL?.startsWith("file:")
  ) {
    base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
  }

  const found = base && locate(base);
  if (found) return nextResolve(pathToFileURL(found).href, context);
  return nextResolve(specifier, context);
}

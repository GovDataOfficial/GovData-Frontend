/**
 * Prepares a standalone build directory.
 * - nextJS standalone output requires these steps
 *   -> https://nextjs.org/docs/pages/api-reference/next-config-js/output
 */
import { existsSync, mkdirSync, cpSync, copyFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const rootDir = join(import.meta.dirname);
const nextBuildDir = join(rootDir, ".next");
const nextBuildStaticDir = join(nextBuildDir, "static");
const nextBuildStandaloneDir = join(nextBuildDir, "standalone");
const nextPublicDir = join("public");
const artefactDir = join("build");

if (!existsSync(nextBuildStandaloneDir)) {
  console.error(".next/standalone dir not found. run next build first !!!");
  process.exit(1);
} else {
  if (existsSync(artefactDir)) {
    rmSync(artefactDir, { recursive: true });
  }
  mkdirSync(artefactDir);

  cpSync(nextBuildStandaloneDir, artefactDir, { recursive: true });
  cpSync(nextPublicDir, artefactDir + "/public", { recursive: true });
  cpSync(nextBuildStaticDir, artefactDir + "/.next/static", {
    recursive: true,
  });
}

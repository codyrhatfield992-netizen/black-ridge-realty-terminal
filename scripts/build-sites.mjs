import { spawnSync } from "node:child_process";
import { cp, mkdir, rm, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");
const server = resolve(dist, "server");
const client = resolve(dist, "client");
const legacyAssets = resolve(dist, "assets");
const openNextAssets = resolve(root, ".open-next", "assets");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

await rm(server, { force: true, recursive: true });
await rm(client, { force: true, recursive: true });
await rm(legacyAssets, { force: true, recursive: true });

run("npm", ["exec", "--", "opennextjs-cloudflare", "build"]);
run("npm", ["exec", "--", "wrangler", "deploy", "--dry-run", "--outdir", "dist/server"]);
run("npm", [
  "exec",
  "--",
  "esbuild",
  "dist/server/worker.js",
  "--minify",
  "--format=esm",
  "--outfile=dist/server/index.js",
]);

await cp(openNextAssets, client, { recursive: true });
await Promise.all([
  rm(resolve(server, "worker.js"), { force: true }),
  rm(resolve(server, "worker.js.map"), { force: true }),
  rm(resolve(server, "README.md"), { force: true }),
]);

await mkdir(server, { recursive: true });
const entry = await stat(resolve(server, "index.js"));

if (entry.size >= 10 * 1024 * 1024) {
  throw new Error("The Sites worker bundle exceeds the 10 MiB deployment limit.");
}

console.log(`Sites bundle ready: ${(entry.size / 1024 / 1024).toFixed(2)} MiB worker, assets in dist/client.`);

import { spawn } from "node:child_process";
import path from "node:path";

const command = process.argv[2];
const extraArgs = process.argv.slice(3);

if (!command || !["dev", "build", "start"].includes(command)) {
  console.error("Usage: node scripts/next-dist.mjs <dev|build|start> [...args]");
  process.exit(1);
}

const distDirMap = {
  dev: ".next-dev",
  build: ".next-build",
  start: ".next-build"
};

const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const env = {
  ...process.env,
  NEXT_DIST_DIR: distDirMap[command]
};

const child = spawn(process.execPath, [nextBin, command, ...extraArgs], {
  stdio: "inherit",
  env
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

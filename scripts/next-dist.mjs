import { spawn } from "node:child_process";
import path from "node:path";

const command = process.argv[2];
const extraArgs = process.argv.slice(3);
const isVercel = process.env.VERCEL === "1";

if (!command || !["dev", "build", "start"].includes(command)) {
  console.error("Usage: node scripts/next-dist.mjs <dev|build|start> [...args]");
  process.exit(1);
}

const distDirMap = {
  dev: ".next-dev",
  build: isVercel ? ".next" : ".next-build",
  start: isVercel ? ".next" : ".next-build"
};

const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const env = {
  ...process.env,
  NEXT_DIST_DIR: process.env.NEXT_DIST_DIR || distDirMap[command]
};

function runNode(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      stdio: "inherit",
      env
    });
    child.on("exit", (code, signal) => {
      if (signal) { process.kill(process.pid, signal); return; }
      if (code === 0) { resolve(); return; }
      reject(new Error(`${path.basename(scriptPath)} exited with code ${code ?? 1}`));
    });
    child.on("error", reject);
  });
}

async function main() {
  try {
    await runNode(nextBin, [command, ...extraArgs]);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void main();

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
const prismaBin = path.join(process.cwd(), "node_modules", "prisma", "build", "index.js");
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
      if (signal) {
        process.kill(process.pid, signal);
        return;
      }

      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${path.basename(scriptPath)} exited with code ${code ?? 1}`));
    });

    child.on("error", reject);
  });
}

async function bootstrapVercelDemoDatabase() {
  if (command !== "build" || env.VERCEL !== "1") {
    return;
  }

  console.log("Preparing SQLite demo database for Vercel build...");
  await runNode(prismaBin, ["db", "push", "--skip-generate"]);
  await runNode(path.join(process.cwd(), "prisma", "seed.mjs"));
}

async function prepareBuildEnvironment() {
  if (command !== "build") {
    return;
  }

  console.log("Generating Prisma client...");
  await runNode(prismaBin, ["generate"]);
  await bootstrapVercelDemoDatabase();
}

async function main() {
  try {
    await prepareBuildEnvironment();
    await runNode(nextBin, [command, ...extraArgs]);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void main();

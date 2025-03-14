#!/usr/bin/env node -S node --no-warnings

import { exec, spawn, spawnSync, type ChildProcess } from "child_process";
import open from "open";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
// import packageJson from "../package.json"
import { program } from "commander";

const data = await import("../package.json", { assert: { type: "json" } })
const packageJson = data.default

// Get the directory of the current module (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read version from package.json using import
const NAME = packageJson.name;
const VERSION = packageJson.version;
const DESCRIPTION = packageJson.description;

program
  .name(NAME)
  .version(VERSION)
  .description(DESCRIPTION)
  .argument("[input]", "URL to check, or localhost port to check (optional)")
  .option("-p, --port <number>", "Specify port number", (value) => parseInt(value, 10), 3050)
  .option("--showdir", "Show directory path of where the command is run")
  .parse(process.argv);

const options = program.opts();

if (options.showdir) {
  console.log(`\n → Running from directory: ${ __dirname }\n`);
  process.exit();
}

const PORT = options.port;

function isPositiveInteger(str: string) {
  return /^[1-9]\d*$/.test(str);
}

const URLorPORT = program.args[0];
const URL = isPositiveInteger(URLorPORT) ? `http://localhost:${ URLorPORT }` : URLorPORT;

console.log(`\n   ▲ Check Site Meta ${ VERSION }`);


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const nextProcess = spawn("node", [path.join(__dirname, "./standalone/server.js")], {
  stdio: ["ignore", "pipe", "pipe"],
  env: {
    ...process.env,
    PORT: String(PORT),
  },
});

nextProcess.stdout.on("data", (data) => {
  const message = String(data)

  if (message.startsWith("   ▲ Next.js ")) {
    process.stdout.write(message.replace("Next.js", "Using Next.js"));
    return
  }
  if (message.startsWith("   - Local:")) {
    process.stdout.write(
      `   - Local: http://localhost:${ PORT }
   - Starting... 🚀\n\n`
    );
    return
  }

  // Detect when the server is ready
  if (message.includes(`✓ Ready in`)) {
    setTimeout(() => {
      // Prompt user if they want to open browser
      rl.question(' ? Do you want to open the browser? (Y/n) ', (answer) => {
        if (answer.toLowerCase() === 'y' || answer === '') {
          console.log(` → Opening browser at http://localhost:${ PORT }`);
          open(`http://localhost:${ PORT }${ URL ? `/?url=${ URL }` : "" }`);
        } else {
          console.log(' → Skipping browser launch.');
        }
        rl.close();
      });
      // console.log(` → Opening browser at http://localhost:${ PORT }`);
      // open(`http://localhost:${ PORT }`);
    }, 10);
  }

  process.stdout.write(`${ data }`);
});

// Read and modify stderr (warnings/errors)
nextProcess.stderr.on("data", (data) => {
  process.stderr.write(`[ERROR] ${ data }`);
});

// Handle process exit
nextProcess.on("exit", (code) => {
  if (code === 0) {
    console.log("\n✅ Next.js server is running!");
  } else {
    console.error("\n❌ Next.js server failed to start.");
  }
});

const cleanup = () => {
  console.log(`\n → Stopping server on port ${ PORT }...`);
  nextProcess.kill("SIGTERM"); // Gracefully stop child process
  process.exit();
};

process.on("SIGINT", cleanup); // Ctrl + C
process.on("SIGTERM", cleanup); // Kill command
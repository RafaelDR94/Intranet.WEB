const net = require("node:net");
const { spawn } = require("node:child_process");

const env = { ...process.env };
const nextBin = require.resolve("next/dist/bin/next");

function canListen(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port);
  });
}

async function getPort() {
  if (env.PORT) {
    return env.PORT;
  }

  for (let port = 3000; port <= 3010; port += 1) {
    // Choose the port before starting Next to avoid its Windows trace race on fallback.
    if (await canListen(port)) {
      return String(port);
    }
  }

  throw new Error("No free port found between 3000 and 3010.");
}

async function main() {
  const port = await getPort();
  const child = spawn(process.execPath, [nextBin, "dev", "-p", port], {
    stdio: "inherit",
    env,
    shell: false,
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

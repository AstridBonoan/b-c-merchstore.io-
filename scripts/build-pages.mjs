import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const env = {
  ...process.env,
  STATIC_EXPORT: "true",
  GITHUB_PAGES: "true",
  NEXT_PUBLIC_DEMO_MODE: "true",
  DEMO_MODE: "true",
  NEXT_PUBLIC_BASE_PATH: "/b-c-merchstore.io-",
  NEXT_PUBLIC_SITE_URL: "https://astridbonoan.github.io/b-c-merchstore.io-",
};

const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, "build"], {
  cwd: root,
  env,
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});

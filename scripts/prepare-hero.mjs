import { copyFile, mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import { resolve, join } from "node:path";
import { spawn } from "node:child_process";
import { runInNewContext } from "node:vm";
import { getDeckProjects, archiveKey } from "../hero/projects.js";

const root = resolve(import.meta.dirname, "..");
const sandbox = { window: {} };
runInNewContext(await readFile(join(root, "data.js"), "utf8"), sandbox);
const output = join(root, "hero");
await mkdir(join(output, "media"), { recursive: true });
await mkdir(join(output, "vendor"), { recursive: true });
await mkdir(join(root, ".deploy-tools"), { recursive: true });
for (const name of ["gsap.min.js", "Flip.min.js", "ScrollTrigger.min.js"]) {
  await copyFile(join(root, "node_modules", "gsap", "dist", name), join(output, "vendor", name));
}
await copyFile(join(root, "node_modules", "gsap", "README.md"), join(output, "vendor", "GSAP-README.md"));
const manifest = join(root, ".deploy-tools", "archive-images.json");
const images = getDeckProjects(sandbox.window.PORTFOLIO_DATA).map(({ id, source }) =>
  ({ id, source: decodeURIComponent(source), key: archiveKey(id) }));
await writeFile(manifest, JSON.stringify(images));
try {
  await new Promise((resolveRun, reject) => {
    const child = spawn(process.env.DEPLOY_PYTHON || "python", [join(root, "scripts", "prepare-archive-images.py"), root, output, manifest], { stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolveRun() : reject(new Error("Archive image optimization failed: " + code)));
  });
} finally { await unlink(manifest); }
console.log(`Prepared ${images.length} archive projects and local GSAP/Flip runtime.`);

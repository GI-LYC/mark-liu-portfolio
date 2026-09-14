import { access, mkdir, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { runInNewContext } from "node:vm";

const root = resolve(import.meta.dirname, "..");
const ffmpeg = process.env.DEPLOY_FFMPEG || join(root, ".deploy-tools/node_modules/ffmpeg-static/ffmpeg.exe");
const sandbox = { window: {} };
runInNewContext(await readFile(join(root, "data.js"), "utf8"), sandbox);
for (const project of sandbox.window.PORTFOLIO_DATA.projects) {
  for (const media of project.media.filter((item) => item.type === "video")) {
    const poster = decodeURIComponent(media.poster);
    if (!poster.startsWith("作品集总结/网页封面/")) continue;
    const target = join(root, poster);
    try { await access(target); continue; } catch {}
    await mkdir(dirname(target), { recursive: true });
    const result = spawnSync(ffmpeg, [
      "-hide_banner", "-loglevel", "error", "-y", "-ss", poster.endsWith("audi-world-cup.jpg") ? "20" : "2",
      "-i", join(root, decodeURIComponent(media.src)),
      "-frames:v", "1", "-vf", "scale=960:-2", "-q:v", "2", target
    ], { stdio: "inherit" });
    if (result.error || result.status !== 0) throw result.error || new Error("Poster extraction failed: " + poster);
    console.log("Poster: " + poster);
  }
}

import { copyFile, cp, mkdir, readFile, rm, stat, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { runInNewContext } from "node:vm";
import { createHash } from "node:crypto";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const assets = join(dist, "assets");
const staticFiles = ["index.html", "portfolio.html", "project.html", "about.html", "contact.html", "app.js", "styles.css", "favicon.svg"];
const toolFfmpeg = process.env.DEPLOY_FFMPEG || resolve(root, ".deploy-tools", "node_modules", "ffmpeg-static", "ffmpeg.exe");
const imageManifest = join(dist, ".image-manifest.json");
const deployPython = process.env.DEPLOY_PYTHON || "python";

const images = [
  ["个人照片.png", "portrait.webp", 1400],
  ["作品集总结/AUDI-E作品/美图/15.png", "audi-15-hero.webp", 1800],
  ["作品集总结/AUDI-E作品/海报/地球日美图 (1).jpg", "audi-earth-01.webp", 1800],
  ["作品集总结/AUDI-E作品/海报/地球日美图 (2).jpg", "audi-earth-02.webp", 1500],
  ["作品集总结/AUDI-E作品/海报/地球日美图 (3).jpg", "audi-earth-03.webp", 1500],
  ["作品集总结/AUDI-E作品/海报/地球日美图 (4).jpg", "audi-earth-04.webp", 1500],
  ["作品集总结/AUDI-E作品/海报/地球日美图 (5).jpg", "audi-earth-05.webp", 1800],
  ["作品集总结/AUDI-E作品/海报/地球日小红书竖版&抖音封面1.jpg", "audi-earth-poster.webp", 1200],
  ["作品集总结/AUDI-E作品/海报/谷雨海报.png", "audi-season-rain.webp", 1400],
  ["作品集总结/AUDI-E作品/美图/1.png", "audi-series-01.webp", 1400],
  ["作品集总结/AUDI-E作品/美图/2.png", "audi-series-02.webp", 1600],
  ["作品集总结/AUDI-E作品/美图/3.png", "audi-series-03.webp", 1600],
  ["作品集总结/AUDI-E作品/美图/4.png", "audi-series-04.webp", 1400],
  ["作品集总结/AUDI-E作品/美图/12.png", "audi-series-12.webp", 1400],
  ["作品集总结/AUDI-E作品/美图/13.png", "audi-series-13.webp", 1400],
  ["作品集总结/AUDI-E作品/海报/立夏3-4.png", "audi-season-summer.webp", 1400],
  ["作品集总结/AUDI-E作品/海报/大雪-1080x1440.png", "audi-season-snow.webp", 1400],
  ["作品集总结/AUDI-E作品/海报/1080x1440.png", "audi-season-alt.webp", 1400],
  ["作品集总结/AUDI-E作品/海报/画板 3.png", "audi-season-wide.webp", 1400],
  ["作品集总结/AUDI-E作品/海报/AUDI原力节.png", "audi-force-festival.webp", 1400],
  ["作品集总结/AUDI-E作品/海报/后视镜里面的春天封面1.jpg", "audi-spring-poster.webp", 1200],
  ["作品集总结/AUDI-E作品/海报/小红书竖版&抖音封面1.jpg", "audi-travel-poster.webp", 1200],
  ["作品集总结/AUDI-E作品/海报/小红书竖版&抖音封面1.png", "audi-xhs-cover.webp", 1200],
  ["作品集总结/吉利作品/美图/变装视频封面.jpg", "geely-transform-cover.webp", 1200],
  ["作品集总结/吉利作品/美图/雪地变装视频视频封面.png", "geely-transform-wide.webp", 1800],
  ["作品集总结/吉利作品/美图/变装1.png", "geely-transform-01.webp", 900],
  ["作品集总结/吉利作品/美图/变装2.png", "geely-transform-02.webp", 900],
  ["作品集总结/吉利作品/美图/变装3.png", "geely-transform-03.webp", 900],
  ["作品集总结/吉利作品/美图/吉利帝豪中国星 (1).png", "geely-star-01.webp", 1100],
  ["作品集总结/吉利作品/美图/吉利帝豪中国星 (2).png", "geely-star-02.webp", 1100],
  ["作品集总结/吉利作品/美图/吉利帝豪中国星 (3).png", "geely-star-03.webp", 1100],
  ["作品集总结/吉利作品/美图/吉利帝豪中国星 (4).png", "geely-star-04.webp", 1100],
  ["作品集总结/吉利作品/美图/领克.png", "geely-lynk.webp", 1100],
  ["作品集总结/吉利作品/美图/轮播封面.jpg", "geely-carousel-poster.webp", 1200]
];

const videoSources = [
  ["作品集总结/AUDI-E作品/视频/奥迪世界日.mp4", "audi-earth-day.mp4"],
  ["作品集总结/AUDI-E作品/视频/后视镜里的春天.mp4", "audi-spring.mp4"],
  ["作品集总结/AUDI-E作品/视频/清明出行.mp4", "audi-travel.mp4"],
  ["作品集总结/吉利作品/视频/变装视频.mp4", "geely-transform.mp4"],
  ["作品集总结/吉利作品/视频/雪地变装视频.mp4", "geely-snow.mp4"],
  ["作品集总结/吉利作品/视频/轮播.mp4", "geely-carousel.mp4"],
  ["作品集总结/吉利作品/视频/吉利中国星&蓝猫官宣视频(3).m4v", "geely-china-star-blue-cat.mp4"]
];
const sandbox = { window: {} };
runInNewContext(await readFile(join(root, "data.js"), "utf8"), sandbox);
const portfolioData = sandbox.window.PORTFOLIO_DATA;

// Pick up project additions without maintaining a second media list by hand.
function includeAsset(url, video = false) {
  const source = decodeURIComponent(url);
  const list = video ? videoSources : images;
  if (list.some(([input]) => input === source)) return;
  const key = createHash("sha256").update(source).digest("hex").slice(0, 12);
  list.push(video ? [source, `video-${key}.mp4`] : [source, `image-${key}.webp`, 1600]);
}
includeAsset(portfolioData.heroCover);
includeAsset(portfolioData.profile.portrait);
for (const project of portfolioData.projects) {
  includeAsset(project.cover);
  includeAsset(project.wideCover);
  for (const media of project.media) {
    includeAsset(media.src, media.type === "video");
    if (media.poster) includeAsset(media.poster);
  }
}

function run(command, args) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolveRun();
      else reject(new Error(`${basename(command)} exited with code ${code}`));
    });
  });
}

async function assertFfmpeg() {
  try {
    await stat(toolFfmpeg);
    return true;
  } catch {
    return false;
  }
}

async function buildImages() {
  await writeFile(imageManifest, JSON.stringify(images), "utf8");
  await run(deployPython, [join(root, "scripts", "optimize-images.py"), root, assets, imageManifest]);
  await unlink(imageManifest);
}

async function buildVideos() {
  const canTranscode = await assertFfmpeg();
  if (!canTranscode) {
    throw new Error("FFmpeg is required to publish all videos. Install ffmpeg-static in .deploy-tools or set DEPLOY_FFMPEG.");
  }
  const cache = join(root, ".deploy-tools", "media-cache");
  await mkdir(cache, { recursive: true });
  for (const [source, output] of videoSources) {
    const input = await stat(join(root, source));
    const key = createHash("sha256").update(source + input.size + input.mtimeMs + "1280-crf25-v1").digest("hex");
    const cached = join(cache, key + ".mp4");
    try {
      await stat(cached);
      await copyFile(cached, join(assets, output));
      console.log("Cached video: " + output);
      continue;
    } catch {}
    console.log("Encoding video: " + source);
    await run(toolFfmpeg, [
      "-hide_banner", "-loglevel", "error",
      "-y",
      "-i",
      join(root, source),
      "-vf",
      "scale=1280:1280:force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1",
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-threads", "4",
      "-pix_fmt", "yuv420p",
      "-crf",
      "25",
      "-movflags",
      "+faststart",
      "-c:a",
      "aac",
      "-b:a",
      "96k",
      join(assets, output)
    ]);
    await copyFile(join(assets, output), cached);
  }
  return new Map(videoSources);
}

async function buildData(publishedVideos) {
  const source = await readFile(join(root, "data.js"), "utf8");
  const sandbox = { window: {} };
  runInNewContext(source, sandbox);
  const data = sandbox.window.PORTFOLIO_DATA;
  const imageOutput = new Map(images.map(([input, output]) => [input, `assets/${output}`]));

  function publishedPath(url, outputs) {
    const result = outputs.get(decodeURIComponent(url));
    if (!result) throw new Error("Unmapped asset: " + url);
    return result;
  }

  data.heroCover = publishedPath(data.heroCover, imageOutput);
  data.profile.portrait = publishedPath(data.profile.portrait, imageOutput);
  data.projects.forEach((project) => {
    project.cover = publishedPath(project.cover, imageOutput);
    project.wideCover = publishedPath(project.wideCover, imageOutput);
    project.media = project.media
      .map((media) => ({
        ...media,
        src:
          media.type === "video"
            ? `assets/${publishedPath(media.src, publishedVideos)}`
            : publishedPath(media.src, imageOutput),
        ...(media.poster ? { poster: publishedPath(media.poster, imageOutput) } : {})
      }));
  });
  await writeFile(
    join(dist, "data.js"),
    `const portfolioData = ${JSON.stringify(data, null, 2)};\n\nwindow.PORTFOLIO_DATA = portfolioData;\n`,
    "utf8"
  );

  let app = await readFile(join(dist, "app.js"), "utf8");
  app = app.replaceAll("作品集总结/AUDI-E作品/海报/谷雨海报.png", "assets/audi-season-rain.webp");
  await writeFile(join(dist, "app.js"), app, "utf8");
}

await run(process.execPath, [join(root, "scripts", "prepare-posters.mjs")]);
await run(process.execPath, [join(root, "scripts", "prepare-hero.mjs")]);
const missingSources = [];
for (const [source] of [...images, ...videoSources]) {
  try { await stat(join(root, source)); } catch { missingSources.push(source); }
}
// A source folder may be offline while the complete published media remain local.
// Validate the full output set before refreshing code or data in that case.
if (missingSources.length) {
  for (const [, output] of [...images, ...videoSources]) await stat(join(assets, output));
  for (const name of staticFiles) await copyFile(join(root, name), join(dist, name));
  await cp(join(root, "hero"), join(dist, "hero"), { recursive: true });
  await buildData(new Map(videoSources));
  console.log(`Built site using verified published media; ${missingSources.length} original sources are unavailable.`);
  process.exit(0);
}
if (dist !== resolve(root, "dist")) throw new Error("Unexpected build directory");
await rm(dist, { recursive: true, force: true });
await mkdir(assets, { recursive: true });
for (const name of staticFiles) {
  await copyFile(join(root, name), join(dist, name));
}
await cp(join(root, "hero"), join(dist, "hero"), { recursive: true });
await buildImages();
const publishedVideos = await buildVideos();
await buildData(publishedVideos);

const entries = [...images.map(([, output]) => output), ...publishedVideos.values()];
let total = 0;
for (const output of entries) {
  total += (await stat(join(assets, output))).size;
}
console.log(`Built ${entries.length} media assets (${(total / 1024 / 1024).toFixed(1)} MB) in ${dirname(join(assets, entries[0]))}.`);

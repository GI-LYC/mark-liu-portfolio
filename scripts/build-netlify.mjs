import { copyFile, mkdir, readFile, rm, stat, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { runInNewContext } from "node:vm";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const assets = join(dist, "assets");
const staticFiles = ["index.html", "portfolio.html", "project.html", "about.html", "contact.html", "app.js", "styles.css", "favicon.svg"];
const toolFfmpeg = resolve(root, ".deploy-tools", "node_modules", "ffmpeg-static", "ffmpeg.exe");
const imageManifest = join(dist, ".image-manifest.json");
const deployPython = process.env.DEPLOY_PYTHON || "python";

const images = [
  ["个人照片.png", "portrait.webp", 1400],
  ["作品集总结/AUDI-E作品/15.png", "audi-15-hero.webp", 1800],
  ["作品集总结/AUDI-E作品/地球日美图 (1).jpg", "audi-earth-01.webp", 1800],
  ["作品集总结/AUDI-E作品/地球日美图 (2).jpg", "audi-earth-02.webp", 1500],
  ["作品集总结/AUDI-E作品/地球日美图 (3).jpg", "audi-earth-03.webp", 1500],
  ["作品集总结/AUDI-E作品/地球日美图 (4).jpg", "audi-earth-04.webp", 1500],
  ["作品集总结/AUDI-E作品/地球日美图 (5).jpg", "audi-earth-05.webp", 1800],
  ["作品集总结/AUDI-E作品/地球日小红书竖版&抖音封面1.jpg", "audi-earth-poster.webp", 1200],
  ["作品集总结/AUDI-E作品/谷雨海报.png", "audi-season-rain.webp", 1400],
  ["作品集总结/AUDI-E作品/1.png", "audi-series-01.webp", 1400],
  ["作品集总结/AUDI-E作品/2.png", "audi-series-02.webp", 1600],
  ["作品集总结/AUDI-E作品/3.png", "audi-series-03.webp", 1600],
  ["作品集总结/AUDI-E作品/4.png", "audi-series-04.webp", 1400],
  ["作品集总结/AUDI-E作品/12.png", "audi-series-12.webp", 1400],
  ["作品集总结/AUDI-E作品/13.png", "audi-series-13.webp", 1400],
  ["作品集总结/AUDI-E作品/立夏3-4.png", "audi-season-summer.webp", 1400],
  ["作品集总结/AUDI-E作品/大雪-1080x1440.png", "audi-season-snow.webp", 1400],
  ["作品集总结/AUDI-E作品/1080x1440.png", "audi-season-alt.webp", 1400],
  ["作品集总结/AUDI-E作品/画板 3.png", "audi-season-wide.webp", 1400],
  ["作品集总结/AUDI-E作品/AUDI原力节.png", "audi-force-festival.webp", 1400],
  ["作品集总结/AUDI-E作品/后视镜里面的春天小红书竖版&抖音封面1.jpg", "audi-spring-poster.webp", 1200],
  ["作品集总结/AUDI-E作品/小红书竖版&抖音封面1.jpg", "audi-travel-poster.webp", 1200],
  ["作品集总结/AUDI-E作品/小红书竖版&抖音封面1.png", "audi-xhs-cover.webp", 1200],
  ["作品集总结/吉利作品/变装视频封面.jpg", "geely-transform-cover.webp", 1200],
  ["作品集总结/吉利作品/ai视频封面.png", "geely-transform-wide.webp", 1800],
  ["作品集总结/吉利作品/变装1.png", "geely-transform-01.webp", 900],
  ["作品集总结/吉利作品/变装2.png", "geely-transform-02.webp", 900],
  ["作品集总结/吉利作品/变装3.png", "geely-transform-03.webp", 900],
  ["作品集总结/吉利作品/吉利帝豪中国星 (1).png", "geely-star-01.webp", 1100],
  ["作品集总结/吉利作品/吉利帝豪中国星 (2).png", "geely-star-02.webp", 1100],
  ["作品集总结/吉利作品/吉利帝豪中国星 (3).png", "geely-star-03.webp", 1100],
  ["作品集总结/吉利作品/吉利帝豪中国星 (4).png", "geely-star-04.webp", 1100],
  ["作品集总结/吉利作品/领克.png", "geely-lynk.webp", 1100],
  ["作品集总结/吉利作品/轮播封面.jpg", "geely-carousel-poster.webp", 1200]
];

const videoSources = [
  ["作品集总结/AUDI-E作品/奥迪世界日.mp4", "audi-earth-day.mp4"],
  ["作品集总结/AUDI-E作品/后视镜里的春天.mp4", "audi-spring.mp4"],
  ["作品集总结/AUDI-E作品/清明出行.mp4", "audi-travel.mp4"],
  ["作品集总结/吉利作品/变装视频.mp4", "geely-transform.mp4"],
  ["作品集总结/吉利作品/雪地变装视频.mp4", "geely-snow.mp4"],
  ["作品集总结/吉利作品/轮播.mp4", "geely-carousel.mp4"],
  ["作品集总结/吉利作品/吉利中国星&蓝猫官宣视频(3).m4v", "geely-china-star-blue-cat.mp4"]
];
const directPublishVideos = new Map([
  ["作品集总结/AUDI-E作品/奥迪世界日.mp4", "audi-earth-day.mp4"],
  ["作品集总结/AUDI-E作品/后视镜里的春天.mp4", "audi-spring.mp4"],
  ["作品集总结/AUDI-E作品/清明出行.mp4", "audi-travel.mp4"],
  ["作品集总结/吉利作品/变装视频.mp4", "geely-transform.mp4"],
  ["作品集总结/吉利作品/雪地变装视频.mp4", "geely-snow.mp4"],
  ["作品集总结/吉利作品/吉利中国星&蓝猫官宣视频(3).m4v", "geely-china-star-blue-cat.mp4"]
]);

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
    for (const [source, output] of directPublishVideos) {
      await copyFile(join(root, source), join(assets, output));
    }
    console.log("FFmpeg unavailable: publishing direct video files; oversized AUDI-E source films remain local.");
    return directPublishVideos;
  }
  for (const [source, output] of videoSources) {
    await run(toolFfmpeg, [
      "-y",
      "-i",
      join(root, source),
      "-vf",
      "scale='min(1280,iw)':-2",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "29",
      "-movflags",
      "+faststart",
      "-c:a",
      "aac",
      "-b:a",
      "96k",
      join(assets, output)
    ]);
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
    return outputs.get(decodeURIComponent(url));
  }

  data.heroCover = publishedPath(data.heroCover, imageOutput);
  data.profile.portrait = publishedPath(data.profile.portrait, imageOutput);
  data.projects.forEach((project) => {
    project.cover = publishedPath(project.cover, imageOutput);
    project.wideCover = publishedPath(project.wideCover, imageOutput);
    project.media = project.media
      .filter((media) => media.type !== "video" || publishedPath(media.src, publishedVideos))
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
  app = app.replaceAll("作品集总结/AUDI-E作品/谷雨海报.png", "assets/audi-season-rain.webp");
  await writeFile(join(dist, "app.js"), app, "utf8");
}

await rm(dist, { recursive: true, force: true });
await mkdir(assets, { recursive: true });
for (const name of staticFiles) {
  await copyFile(join(root, name), join(dist, name));
}
await buildImages();
const publishedVideos = await buildVideos();
await buildData(publishedVideos);

const entries = [...images.map(([, output]) => output), ...publishedVideos.values()];
let total = 0;
for (const output of entries) {
  total += (await stat(join(assets, output))).size;
}
console.log(`Built ${entries.length} media assets (${(total / 1024 / 1024).toFixed(1)} MB) in ${dirname(join(assets, entries[0]))}.`);

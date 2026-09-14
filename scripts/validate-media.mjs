import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import { runInNewContext } from "node:vm";

const root = resolve(import.meta.dirname, "..");
async function readData(directory) {
  const sandbox = { window: {} };
  runInNewContext(await readFile(join(directory, "data.js"), "utf8"), sandbox);
  return sandbox.window.PORTFOLIO_DATA;
}
const source = await readData(root);
const published = await readData(join(root, "dist"));
assert.equal(source.projects.length, published.projects.length);
assert.equal(new Set(source.projects.map((project) => project.id)).size, source.projects.length);
for (const [index, project] of source.projects.entries()) {
  assert.equal(project.id, published.projects[index].id);
  assert.equal(project.media.length, published.projects[index].media.length, "Dropped media: " + project.id);
}
const publishedOnly = process.argv.includes('--published');
const targets = publishedOnly ? [[join(root, 'dist'), published]] : [[root, source], [join(root, 'dist'), published]];
for (const [directory, data] of targets) {
  const paths = [data.heroCover, data.profile.portrait];
  for (const project of data.projects) {
    paths.push(project.cover, project.wideCover);
    for (const media of project.media) {
      paths.push(media.src);
      if (media.type === "video") paths.push(media.poster);
    }
  }
  for (const path of new Set(paths)) {
    assert.ok(typeof path === "string" && !path.includes("undefined"), "Invalid media reference");
    const file = await stat(join(directory, decodeURIComponent(path)));
    assert.ok(file.isFile() && file.size > 0, "Empty media: " + path);
  }
}
console.log(JSON.stringify({
  scope: publishedOnly ? 'published' : 'source-and-published',
  projects: source.projects.length,
  images: source.projects.flatMap((project) => project.media).filter((media) => media.type === "image").length,
  videos: source.projects.flatMap((project) => project.media).filter((media) => media.type === "video").length,
  missingAssets: 0,
  droppedMedia: 0
}));

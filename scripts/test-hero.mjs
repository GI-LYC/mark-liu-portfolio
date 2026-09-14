import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { resolve, join } from "node:path";
import { getDeckProjects } from "../hero/projects.js";
import { fitCover } from "../hero/archive-state.js";

const root = resolve(import.meta.dirname, "..");
const sandbox = { window: {} };
runInNewContext(await readFile(join(root, "data.js"), "utf8"), sandbox);
const data = sandbox.window.PORTFOLIO_DATA;
const manifest = JSON.parse(await readFile(join(root, "hero/manifest.json"), "utf8"));
const projects = getDeckProjects(data, manifest);

test("the deck uses ten unique real projects with valid detail links", () => {
  assert.equal(projects.length, 10);
  const selected = projects;
  assert.equal(selected.length, 10);
  assert.equal(
    JSON.stringify([...new Set(selected.map(({ project }) => project.id))].sort()),
    JSON.stringify(data.projects.slice(0, 10).map(({ id }) => id).sort())
  );
  projects.forEach(project => assert.ok(project.url.includes(project.project.id)));
});

test("priority works lead the deck and the new Wuling film is included", () => {
  assert.deepEqual(Array.from(projects.slice(0, 3), item => item.project.id), ['audi-world-cup', 'geely-ai-story', 'wuling-reborn']);
  assert.equal(data.projects.length, 11);
  const added = data.projects.find(project => project.id === 'wuling-reborn');
  assert.equal(added.media.length, 1);
  assert.equal(added.media[0].type, 'video');
  assert.ok(decodeURIComponent(added.media[0].src).endsWith('重生我是顾家千金.mp4'));
  data.projects.forEach((project, index) => assert.equal(project.number, String(index + 1).padStart(2, '0')));
});

test("each deck project carries dimensions, original ratio and a portrait crop position", () => {
  projects.forEach((project) => {
    assert.ok(project.originalWidth > 0 && project.originalHeight > 0);
    assert.equal(project.ratio, project.originalWidth / project.originalHeight);
    assert.equal(project.originalAspectRatio, `${project.originalWidth} / ${project.originalHeight}`);
    assert.equal(project.previewAspectRatio, "4 / 5");
    assert.match(project.previewPosition, /^\d+% \d+%$/);
  });
});

test("complete previews fit the available desktop and mobile frame without cropping", () => {
  for (const [width, height] of [[1200, 778], [1008, 648], [343, 455]]) {
    projects.forEach((project) => {
      const preview = fitCover(width, height, project.ratio);
      assert.ok(preview.width <= width && preview.height <= height);
      assert.ok(Math.abs(preview.width / preview.height - project.ratio) < .00001);
    });
  }
});

test("every selected project has generated thumbnail and full preview assets", async () => {
  let thumbBytes = 0;
  const selected = projects;
  for (const project of selected) {
    const asset = manifest[project.id];
    assert.ok(asset, `Missing manifest: ${project.id}`);
    const thumb = await stat(join(root, "hero", asset.thumb));
    const cover = await stat(join(root, "hero", asset.cover));
    assert.ok(thumb.size > 0 && cover.size > 0);
    assert.ok(thumb.size < 60 * 1024);
    thumbBytes += thumb.size;
  }
  assert.ok(thumbBytes < selected.length * 60 * 1024);
});

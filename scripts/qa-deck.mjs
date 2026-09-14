import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE || 'C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const { chromium } = require('playwright');
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const output = new URL('../.deploy-tools/deck-qa/', import.meta.url);
await mkdir(output, { recursive: true });
const results = [];
try {
  await page.goto('http://127.0.0.1:4173/dist/index.html');
  await page.waitForFunction(() => document.querySelector('[data-work-deck]')?.dataset.activeIndex === '0');
  await page.waitForTimeout(1200);
  assert.deepEqual(await page.locator('.deck-world .work-card').evaluateAll(cards => cards.slice(0, 3).map(card => card.dataset.projectId)), ['audi-world-cup', 'geely-ai-story', 'wuling-reborn']);
  assert.deepEqual(await page.locator('[data-home-projects] > a').evaluateAll(cards => cards.slice(0, 3).map(card => new URL(card.href).searchParams.get('id'))), ['audi-world-cup', 'geely-ai-story', 'wuling-reborn']);
  for (const [width, height] of [[1920,1080], [1440,900], [1366,768], [390,844]]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(500);
    const layout = await page.evaluate(() => ({
      cards: document.querySelectorAll('.work-card').length,
      loaded: [...document.querySelectorAll('.work-card-thumb')].filter(image => image.naturalWidth > 0).length,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      top: document.querySelector('[data-work-deck]').getBoundingClientRect().top,
      playing: [...document.querySelectorAll('.work-card video')].filter(video => !video.paused).length,
      coverLoads: document.querySelectorAll('.work-card-cover[src]').length
    }));
    assert.equal(layout.cards, 10); assert.equal(layout.loaded, 10); assert.equal(layout.horizontalOverflow, false);
    assert.ok(layout.playing <= 1); assert.ok(layout.coverLoads <= 3);
    await page.screenshot({ path: fileURLToPath(new URL(`${width}.png`, output)) });
    results.push({ viewport: [width, height], ...layout });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(600);
  const rearHit = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.work-card')];
    const target = cards[3]; const rect = target.getBoundingClientRect();
    for (let x = Math.max(1, rect.left); x < Math.min(innerWidth, rect.right); x += 3) {
      const y = rect.top + rect.height / 2;
      if (document.elementFromPoint(x,y)?.closest('.work-card') === target) return { x, y };
    }
    return null;
  });
  assert.ok(rearHit, 'Rear card has a real exposed hitbox');
  await page.mouse.click(rearHit.x, rearHit.y);
  await page.waitForTimeout(1600);
  assert.equal(await page.locator('[data-work-deck]').getAttribute('data-active-index'), '3');
  assert.equal(await page.locator('dialog').evaluate(element => element.open), false);
  await page.locator('.work-card.is-active').click();
  await page.waitForTimeout(900);
  assert.equal(await page.locator('dialog').evaluate(element => element.open), true);
  const preview = await page.locator('.work-card.is-preview').evaluate(element => ({
    width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height,
    fit: getComputedStyle(element.querySelector('img')).objectFit,
    title: element.dataset.projectId,
    imageRatio: element.querySelector('.work-card-cover').naturalWidth / element.querySelector('.work-card-cover').naturalHeight
  }));
  assert.equal(preview.fit, 'contain');
  assert.ok(Math.abs(preview.width / preview.height - preview.imageRatio) < .002);
  const expected = await page.evaluate(() => window.PORTFOLIO_DATA.projects[3].id);
  assert.equal(preview.title, expected);
  assert.ok((await page.locator('[data-preview-view]').getAttribute('href')).includes(expected));
  await page.screenshot({ path: fileURLToPath(new URL('preview.png', output)) });
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
  assert.equal(await page.locator('dialog').evaluate(element => element.open), false);
  await page.locator('.work-card.is-active').click(); await page.waitForTimeout(800);
  await page.locator('[data-preview-close]').click(); await page.waitForTimeout(800);
  assert.equal(await page.locator('dialog').evaluate(element => element.open), false);
  await page.mouse.move(700,400); await page.mouse.wheel(0, 650); await page.waitForTimeout(1700);
  const afterWheel = Number(await page.locator('[data-work-deck]').getAttribute('data-active-index'));
  assert.ok(afterWheel > 3);
  const snap = await page.evaluate(() => {
    const t = ScrollTrigger.getById('work-deck');
    return { position: t.progress * 9, top: document.querySelector('[data-work-deck]').getBoundingClientRect().top };
  });
  assert.ok(Math.abs(snap.position - Math.round(snap.position)) < .03);
  assert.ok(Math.abs(snap.top) < 2);
  await page.locator('[data-deck-steps] button').last().click(); await page.waitForTimeout(1600);
  assert.equal(await page.locator('[data-work-deck]').getAttribute('data-active-index'), '9');
  await page.mouse.wheel(0, 950); await page.waitForTimeout(1000);
  assert.ok(await page.locator('[data-work-deck]').evaluate(element => element.getBoundingClientRect().top < -100));
  assert.equal(await page.locator('.work-card video').evaluateAll(videos => videos.filter(video => !video.paused).length), 0);
  await page.mouse.wheel(0, -1050); await page.waitForTimeout(1600);
  results.push({ rearClick: true, preview, close: true, escape: true, afterWheel, snap, exit: true, returnIndex: await page.locator('[data-work-deck]').getAttribute('data-active-index') });
  await page.locator('[data-deck-steps] button').first().click(); await page.waitForTimeout(1500);
  await page.locator('.work-card.is-active').click(); await page.waitForTimeout(800);
  await page.mouse.click(30, 350); await page.waitForTimeout(750);
  assert.equal(await page.locator('dialog').evaluate(element => element.open), false);
  await page.locator('.work-card.is-active').click(); await page.waitForTimeout(800);
  await page.locator('[data-preview-view]').click();
  await page.waitForURL('**/project.html?id=audi-world-cup');
  assert.ok((await page.locator('h1').textContent()).includes('World Cup'));
  results.push({ backgroundClose: true, detailRoute: page.url() });
  await page.goBack();
  await page.waitForFunction(() => document.querySelectorAll('.deck-world .work-card').length === 10);
  assert.equal(await page.locator('.is-preview').count(), 0);
  await page.goto('http://127.0.0.1:4173/dist/portfolio.html');
  assert.equal(await page.locator('.project-card').count(), 11);
  assert.deepEqual(await page.locator('.project-card').evaluateAll(cards => cards.slice(0, 3).map(card => new URL(card.href).searchParams.get('id'))), ['audi-world-cup', 'geely-ai-story', 'wuling-reborn']);
  await page.locator('.project-card').nth(2).click();
  await page.waitForURL('**/project.html?id=wuling-reborn');
  const film = page.locator('video').first();
  await film.evaluate(video => { video.muted = true; return video.play(); });
  await page.waitForTimeout(400);
  const filmState = await film.evaluate(video => ({ duration: video.duration, width: video.videoWidth, height: video.videoHeight, playing: !video.paused, time: video.currentTime }));
  assert.ok(filmState.duration > 81 && filmState.duration < 83);
  assert.ok(filmState.playing && filmState.time > 0);
  assert.ok(Math.abs(filmState.width / filmState.height - 9 / 16) < .002);
  await film.evaluate(video => video.pause());
  results.push({ portfolioCount: 11, priorityOrder: true, newFilm: filmState });
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobile = await mobileContext.newPage();
  mobile.on('pageerror', error => errors.push(error.message));
  await mobile.goto('http://127.0.0.1:4173/dist/index.html');
  await mobile.waitForFunction(() => document.querySelector('[data-work-deck]')?.dataset.activeIndex === '0');
  const cdp = await mobileContext.newCDPSession(mobile);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 280, y: 400 }] });
  for (const x of [240, 200, 160, 120, 80]) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: 400 }] });
    await mobile.waitForTimeout(30);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await mobile.waitForTimeout(1600);
  assert.equal(await mobile.locator('[data-work-deck]').getAttribute('data-active-index'), '1');
  await mobile.locator('.work-card.is-active').tap(); await mobile.waitForTimeout(800);
  assert.equal(await mobile.locator('dialog').evaluate(element => element.open), true);
  await mobile.locator('[data-preview-close]').tap(); await mobile.waitForTimeout(700);
  await mobile.locator('.menu-toggle').tap();
  assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  results.push({ mobileSwipe: true, mobilePreview: true, mobileNavigation: true });
  await mobileContext.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ results, errors }, null, 2));
  await writeFile(new URL('results.json', output), JSON.stringify({ results, errors }, null, 2));
} finally { console.log('Browser errors:', errors); await browser.close(); }

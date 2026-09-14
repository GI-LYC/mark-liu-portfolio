import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE || 'C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const { chromium } = require('playwright');
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const errors = [], results = [];
const output = new URL('../.deploy-tools/language-qa/', import.meta.url);
await mkdir(output, { recursive: true });
try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const route of ['index.html', 'portfolio.html', 'about.html', 'contact.html', 'project.html?id=audi-seasons', 'project.html?id=wuling-reborn']) {
      await page.goto(`http://127.0.0.1:4173/dist/${route}`);
      await page.waitForTimeout(650);
      if (route === 'index.html') await page.waitForFunction(() => document.querySelector('[data-work-deck]')?.dataset.activeIndex === '0');
      const audit = await page.evaluate(() => {
        const ratios = [...document.querySelectorAll('.bilingual')].filter(element => element.getBoundingClientRect().height > 0).map(element => {
          const zh = element.querySelector(':scope > .ui-zh'), en = element.querySelector(':scope > .ui-en');
          if (!zh || !en) return null;
          return { text: zh.textContent, ratio: parseFloat(getComputedStyle(en).fontSize) / parseFloat(getComputedStyle(zh).fontSize), opacity: Number(getComputedStyle(en).opacity) };
        }).filter(Boolean);
        const englishUi = [...document.querySelectorAll('a,button,h1,h2,h3,.eyebrow')].filter(element => {
          if (!element.getBoundingClientRect().height || !element.textContent.trim()) return false;
          const text = element.textContent.trim();
          return /[a-z]/i.test(text) && !/[\u3400-\u9fff]/.test(text) && !text.includes('@') && !/^(?:\d+\s*\/\s*)?(AUDI-E|GEELY|WULING|[\d\s/]+)$/i.test(text) && !element.closest('[lang="en"]');
        }).map(element => element.textContent.trim());
        return { overflow: document.documentElement.scrollWidth > innerWidth, name: document.querySelector('.brand .ui-zh')?.textContent, nav: [...document.querySelectorAll('.nav-link .ui-zh')].map(element => element.textContent), ratios, englishUi };
      });
      assert.equal(audit.overflow, false, `${route} ${width}: horizontal overflow`);
      assert.equal(audit.name, '刘奕辰');
      assert.deepEqual(audit.nav, ['首页', '作品集', '关于我', '联系']);
      assert.deepEqual(audit.englishUi, [], `${route}: untranslated UI`);
      audit.ratios.forEach(item => { assert.ok(item.ratio >= .45 && item.ratio <= .65, JSON.stringify(item)); assert.ok(item.opacity >= .45 && item.opacity <= .65); });
      results.push({ route, width, bilingualLabels: audit.ratios.length, overflow: audit.overflow });
      if (['index.html','about.html','contact.html'].includes(route)) await page.screenshot({ path: fileURLToPath(new URL(`${route}-${width}.png`, output)) });
      if (route === 'index.html') {
        await page.locator('.work-card.is-active').click(); await page.waitForTimeout(800);
        assert.equal(await page.locator('[data-preview-close] .ui-zh').textContent(), '关闭 ×');
        assert.equal(await page.locator('[data-preview-view] .ui-zh').textContent(), '查看项目 →');
        await page.keyboard.press('Escape'); await page.waitForTimeout(600);
        await page.locator('.deck-footer a').click(); await page.waitForTimeout(600);
        await page.screenshot({ path: fileURLToPath(new URL(`selected-${width}.png`, output)) });
        await page.locator('[data-selected-filter="AIGC FILM"]').click();
        assert.ok(await page.locator('[data-selected-project]').count() > 0);
      }
      if (route === 'about.html') assert.ok(await page.locator('[data-profile-portrait]').evaluate(image => image.naturalWidth > 0));
      if (route === 'project.html?id=audi-seasons') {
        await page.locator('[data-gallery-scroll="next"]').click();
        await page.locator('[data-lightbox-src]').first().click();
        assert.equal(await page.locator('[data-lightbox]').evaluate(dialog => dialog.open), true);
        await page.locator('[data-lightbox] button').click();
      }
    }
  }
  assert.deepEqual(errors, []);
  await writeFile(new URL('results.json', output), JSON.stringify({ results, errors }, null, 2));
  console.log(JSON.stringify({ results, errors }, null, 2));
} finally { console.log('Browser errors:', errors); await browser.close(); }

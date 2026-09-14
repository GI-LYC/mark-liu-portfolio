# Layered Work Deck

The homepage presents ten unique projects in a warm-white, right-aligned portrait deck. Real optimized covers are visible immediately. The original project data and detail URLs remain the source of truth.

- `projects.js`: selects projects, resolves optimized covers, original image dimensions, crop positions, and an optional video preview (falling back to the project's first video).
- `preview.js`: creates semantic card buttons and loads high-resolution covers only for visited current/adjacent projects. Only the active card's muted video plays; hidden, background and offscreen videos pause.
- `motion.js`: pins the Hero with GSAP ScrollTrigger, maps scroll progress to a continuous deck position, snaps to a project, and releases after the last project. Rear-card clicks select; active-card clicks expand the same DOM element via Flip into a native dialog at its original image ratio. Close, backdrop and Escape return it to the deck.
- `hero.css`: portrait cards, subtle perspective, mobile layout, minimal metadata and reduced-motion styling.

Mobile supports horizontal swipe and normal vertical scroll. Numbered controls and arrow keys provide alternatives to scrolling. The header's WORK, ABOUT, PROCESS and CONTACT links remain available.

Run `npm run build` and open `http://127.0.0.1:4173/dist/index.html` using `npm run dev`. Use HTTP rather than opening `index.html` with `file://`, because the Hero uses JavaScript modules and a fetched image manifest.

If original source files are unavailable, the build verifies and reuses the complete existing published media set in `dist/assets`. It fails if any required published file is missing. It never substitutes placeholder images.

Validation: `npm run test:hero`; `node scripts/validate-media.mjs --published`. The latter checks published media and unchanged project/media counts; omit `--published` to additionally require all originals to exist. `node scripts/qa-deck.mjs` runs real-browser viewport, click, scroll, preview, video and console checks when Playwright and Chrome are available (set `PLAYWRIGHT_PACKAGE` to a Playwright package.json path if needed).

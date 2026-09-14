import { getDeckProjects } from './projects.js';
import { createWorkCard, createDeckAssets } from './preview.js';
import { setupWorkDeck } from './motion.js';
const root = document.querySelector('[data-work-deck]');
if (root && window.PORTFOLIO_DATA) {
  let manifest = {};
  try {
    const response = await fetch(new URL('manifest.json', import.meta.url));
    if (response.ok) manifest = await response.json();
  } catch { /* Original covers remain a usable fallback. */ }
  const cards = getDeckProjects(window.PORTFOLIO_DATA, manifest).map(createWorkCard);
  root.querySelector('[data-deck-world]').replaceChildren(...cards.map(card => card.element));
  let cleanup;
  function mount() {
    cleanup?.();
    const assets = createDeckAssets(cards);
    const stop = setupWorkDeck(root, cards, assets);
    cleanup = () => { stop(); assets.destroy(); };
  }
  mount();
  window.addEventListener('pagehide', () => cleanup?.());
  window.addEventListener('pageshow', event => { if (event.persisted) mount(); });
}

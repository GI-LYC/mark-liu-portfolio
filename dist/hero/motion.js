import { fitCover } from './archive-state.js';
export function setupWorkDeck(root, cards, assets) {
  const { gsap, ScrollTrigger, Flip } = window;
  gsap.registerPlugin(ScrollTrigger, Flip);
  const world = root.querySelector('[data-deck-world]');
  const meta = root.querySelector('[data-deck-meta]');
  const steps = root.querySelector('[data-deck-steps]');
  const dialog = document.querySelector('[data-deck-preview]');
  const frame = dialog.querySelector('[data-preview-frame]');
  const close = dialog.querySelector('[data-preview-close]');
  const events = new AbortController(), { signal } = events;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const playhead = { position: 0 };
  let active = -1, opened = null, busy = false, alive = true, scrollTween;
  let lastCardSize = '';
  let oldOverflow = '', oldFocus = null;
  const last = cards.length - 1;
  const count = value => String(value).padStart(2, '0');
  function writeMeta(project, target) {
    const { bilingual, projectTitle } = window.PORTFOLIO_UI;
    target.querySelector('[data-project-title]').innerHTML = projectTitle(project.project);
    target.querySelector('[data-project-category]').innerHTML = bilingual(project.category, project.project.typeEn);
    target.querySelector('[data-project-role]').innerHTML = bilingual(project.role, project.project.roleEn);
    target.querySelector('[data-project-year]').textContent = project.year;
  }
  cards.forEach(({ project }, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = count(index + 1);
    button.setAttribute('aria-label', `选择第 ${index + 1} 件作品：${project.title}`);
    button.addEventListener('click', () => select(index), { signal }); steps.append(button);
  });
  function setActive(index) {
    if (active === index) return;
    active = index; root.dataset.activeIndex = String(index);
    cards.forEach((card, i) => {
      card.element.classList.toggle('is-active', i === index);
      card.element.setAttribute('aria-label', `${i === index ? '打开完整预览' : '选择作品'}：${card.project.title}`);
      steps.children[i].setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    writeMeta(cards[index].project, meta);
    root.querySelector('[data-deck-count]').textContent = `${count(index + 1)} / ${count(cards.length)}`;
    gsap.fromTo(meta, { opacity: .3, y: 7 }, { opacity: 1, y: 0, duration: reduced.matches ? 0 : .3, overwrite: true });
    assets.update(index, root.getBoundingClientRect().bottom > 0 && !opened);
  }
  function render() {
    const mobile = innerWidth <= 700;
    const height = mobile ? Math.min(innerWidth, innerHeight * .55) : Math.min(innerHeight * .59, 690);
    const width = mobile ? Math.min(innerWidth * .78, height * .8) : height * .8;
    const anchor = innerWidth * (mobile ? .47 : .48);
    const step = innerWidth * (mobile ? .075 : .069);
    if (lastCardSize !== `${width}:${height}`) {
      world.style.setProperty('--card-width', `${width}px`);
      world.style.setProperty('--card-height', `${height}px`);
      lastCardSize = `${width}:${height}`;
    }
    cards.forEach((card, i) => {
      if (card === opened) return;
      const distance = i - playhead.position, behind = Math.max(0, distance), exit = Math.max(0, -distance);
      gsap.set(card.element, {
        x: anchor + behind * step * (1 - Math.min(behind, 9) * .012) - exit * width * 1.15,
        y: 0, z: mobile ? -behind * 12 : -behind * 38, xPercent: -50, yPercent: -50,
        rotationY: mobile ? 0 : -3 + Math.min(behind, 9) * .55,
        scale: Math.max(.88, 1 - behind * .014) - Math.min(exit, 1) * .04,
        opacity: exit ? Math.max(0, 1 - exit * 1.6) : Math.max(.5, 1 - behind * .048),
        zIndex: 100 - i, force3D: true
      });
      const reachable = distance > -.55;
      card.element.style.pointerEvents = reachable ? 'auto' : 'none';
      card.element.tabIndex = reachable ? 0 : -1;
      card.element.setAttribute('aria-hidden', reachable ? 'false' : 'true');
    });
    setActive(Math.max(0, Math.min(last, Math.round(playhead.position))));
  }
  const animation = gsap.to(playhead, { position: last, ease: 'none', paused: true, onUpdate: render });
  const trigger = ScrollTrigger.create({
    id: 'work-deck', trigger: root, start: 'top top', end: () => `+=${Math.max(400, innerHeight * .62) * last}`,
    pin: true, anticipatePin: 1, animation, scrub: reduced.matches ? true : .28,
    snap: { snapTo: progress => scrollTween?.isActive() ? progress : Math.round(progress * last) / last, duration: { min: .25, max: .4 }, delay: .2, ease: 'power2.out', inertia: false },
    invalidateOnRefresh: true, onLeave: () => assets.update(active, false),
    onEnterBack: () => assets.update(active, !opened), onRefresh: render
  });
  function select(index) {
    if (opened || busy) return;
    const next = Math.max(0, Math.min(last, index));
    trigger.getTween(true)?.kill?.(); scrollTween?.kill();
    const scroll = { y: scrollY };
    scrollTween = gsap.to(scroll, {
      y: trigger.start + (trigger.end - trigger.start) * next / last,
      duration: reduced.matches ? .01 : .65, ease: 'power3.inOut',
      onUpdate: () => { trigger.getTween(true)?.kill?.(); window.scrollTo(0, scroll.y); },
      onComplete: () => { trigger.getTween(true)?.kill?.(); window.scrollTo(0, trigger.start + (trigger.end - trigger.start) * next / last); }
    });
  }
  function previewSize(card) {
    const size = fitCover(Math.min(innerWidth * .88, 1200), innerHeight * .71, card.project.ratio);
    gsap.set(card.element, { width: size.width, height: size.height, x: 0, y: 0, z: 0, xPercent: 0, yPercent: 0, rotationY: 0, scale: 1, opacity: 1 });
  }
  function openPreview(card) {
    if (opened || busy) return;
    busy = true; scrollTween?.kill(); trigger.getTween(true)?.kill?.(); trigger.getTween()?.progress?.(1);
    const state = Flip.getState(card.element);
    opened = card; oldFocus = document.activeElement; oldOverflow = document.body.style.overflow;
    trigger.disable(false); document.body.style.overflow = 'hidden'; assets.update(active, false);
    dialog.showModal(); frame.append(card.element); card.element.classList.add('is-preview');
    card.element.setAttribute('aria-label', `${card.project.title} 完整画幅`);
    previewSize(card); writeMeta(card.project, dialog);
    dialog.querySelector('[data-preview-view]').href = card.project.url;
    Flip.from(state, { duration: reduced.matches ? .01 : .65, ease: 'power3.inOut', scale: true, absolute: true, onComplete: () => { busy = false; close.focus(); } });
  }
  function closePreview() {
    if (!opened || busy) return;
    busy = true;
    const card = opened, state = Flip.getState(card.element);
    dialog.close(); card.element.classList.remove('is-preview');
    world.insertBefore(card.element, cards[card.project.index + 1]?.element || null);
    gsap.set(card.element, { clearProps: 'width,height' }); opened = null;
    document.body.style.overflow = oldOverflow; trigger.enable(false, false); render();
    Flip.from(state, { duration: reduced.matches ? .01 : .55, ease: 'power3.inOut', scale: true, absolute: true, onComplete: () => {
      busy = false; if (!alive) return;
      assets.update(active, trigger.isActive || scrollY === 0); oldFocus?.focus({ preventScroll: true });
    } });
  }
  cards.forEach(card => card.element.addEventListener('click', () => {
    if (opened) return;
    if (active === card.project.index) openPreview(card); else select(card.project.index);
  }, { signal }));
  close.addEventListener('click', closePreview, { signal });
  dialog.addEventListener('cancel', event => { event.preventDefault(); closePreview(); }, { signal });
  dialog.addEventListener('click', event => { if (event.target === dialog) closePreview(); }, { signal });
  root.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); select(active + (event.key === 'ArrowRight' ? 1 : -1)); }
  }, { signal });
  let touchStart = null;
  world.addEventListener('touchstart', event => { touchStart = event.touches[0]; }, { signal, passive: true });
  world.addEventListener('touchend', event => {
    if (!touchStart || opened) return;
    const dx = event.changedTouches[0].clientX - touchStart.clientX, dy = event.changedTouches[0].clientY - touchStart.clientY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) select(active + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { signal, passive: true });
  window.addEventListener('resize', () => { render(); if (opened) previewSize(opened); }, { signal });
  render();
  return () => {
    alive = false; events.abort(); scrollTween?.kill(); trigger.kill(); animation.kill();
    gsap.killTweensOf(cards.map(card => card.element)); steps.replaceChildren();
    if (opened) {
      dialog.close(); document.body.style.overflow = oldOverflow;
      world.insertBefore(opened.element, cards[opened.project.index + 1]?.element || null);
      opened.element.classList.remove('is-preview');
      gsap.set(opened.element, { clearProps: 'width,height' });
    }
  };
}

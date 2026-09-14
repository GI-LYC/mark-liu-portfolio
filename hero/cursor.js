export function createArchiveCursor(root, world, enabled) {
  const cursor = root.querySelector("[data-archive-cursor]");
  const controller = new AbortController(), { signal } = controller;
  let raf = 0, visible = false;
  let x = 0, y = 0, tx = 0, ty = 0, rx = 0, ry = 0, trx = 0, targetRY = 0;
  const request = () => { if (!raf) raf = requestAnimationFrame(tick); };
  function tick() {
    raf = 0;
    x += (tx - x) * .2; y += (ty - y) * .2;
    rx += (trx - rx) * .12; ry += (targetRY - ry) * .12;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    world.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(trx - rx) + Math.abs(targetRY - ry) > .05) request();
  }
  function hide() {
    visible = false;
    root.classList.remove("has-archive-cursor"); cursor.classList.remove("is-view");
    trx = targetRY = 0;
    if (enabled() && !document.hidden) request();
    else { cancelAnimationFrame(raf); raf = 0; world.style.transform = "none"; }
  }
  root.addEventListener("pointermove", (event) => {
    if (!enabled() || event.pointerType !== "mouse") return;
    tx = event.clientX; ty = event.clientY;
    if (!visible) { x = tx; y = ty; }
    visible = true;
    root.classList.add("has-archive-cursor");
    cursor.classList.toggle("is-view", Boolean(event.target.closest(".archive-panel.is-active, .archive-view")));
    const amount = root.dataset.archivePhase === "selected" ? .25 : 1;
    trx = -(ty / innerHeight * 2 - 1) * amount; targetRY = (tx / innerWidth * 2 - 1) * 2 * amount;
    request();
  }, { signal, passive: true });
  root.addEventListener("pointerleave", hide, { signal });
  root.addEventListener("focusin", hide, { signal });
  window.addEventListener("scroll", hide, { signal, passive: true });
  window.addEventListener("blur", hide, { signal });
  window.addEventListener("keydown", hide, { signal });
  document.addEventListener("visibilitychange", hide, { signal });
  return { hide, destroy() { controller.abort(); cancelAnimationFrame(raf); root.classList.remove("has-archive-cursor"); world.style.removeProperty("transform"); } };
}

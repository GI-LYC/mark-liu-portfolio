export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const mix = (a, b, t) => a + (b - a) * t;
const smooth = (start, end, value) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

// Resting beats at either end leave room for the identity and a clean exit.
export function archiveState(progress, count) {
  const position = clamp(progress) * (count + 1);
  const index = count ? clamp(Math.round(position) - 1, 0, count - 1) : -1;
  const weights = Array.from({ length: count }, (_, i) => 1 - smooth(.2, .9, Math.abs(position - i - 1)));
  const strength = Math.max(0, ...weights);
  return { position, index, weights, strength, meta: smooth(.72, .98, strength) };
}
export function snapArchiveProgress(progress, count) {
  return count ? clamp(Math.round(clamp(progress) * (count + 1)) / (count + 1)) : 0;
}
export const projectProgress = (index, count) => count ? clamp((index + 1) / (count + 1)) : 0;
export function fitCover(width, height, ratio) {
  const safeRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : 16 / 9;
  const w = Math.min(width, height * safeRatio);
  return { width: w, height: w / safeRatio };
}
export function panelState(index, weight, strength, viewport, calm = false) {
  const side = index % 2 === 0 ? -1 : 1, depth = Math.floor(index / 2);
  const mobile = viewport.width <= 700;
  const base = calm
    ? { x: side * 18, y: depth % 3 * 9, z: 0, rotate: 0, scale: .96, opacity: .035, blur: 0 }
    : mobile
      ? { x: side * 16, y: 46 + depth % 5 * 20, z: -160 - depth % 5 * 70, rotate: 0, scale: .82, opacity: Math.max(.1, .32 - depth * .025), blur: 1.4 }
      : { x: side * viewport.width * .52, y: 0, z: -500 - depth * 235, rotate: -side * 61, scale: Math.max(.65, 1.28 - depth * .07), opacity: Math.max(.1, .64 - depth * .075), blur: Math.min(5, depth * .8) };
  return {
    x: (base.x + (mobile || calm ? 0 : side * strength * 80)) * (1 - weight),
    y: base.y * (1 - weight), z: base.z * (1 - weight), rotate: base.rotate * (1 - weight),
    scale: mix(base.scale, 1, weight), opacity: mix(base.opacity, 1, weight),
    blur: base.blur * (1 - weight), saturation: mix(.1, 1, weight)
  };
}

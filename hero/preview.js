export function createWorkCard(project) {
  const element = document.createElement('button');
  element.type = 'button'; element.className = 'work-card';
  element.dataset.projectId = project.project.id;
  element.style.setProperty('--cover-position', project.previewPosition);
  element.setAttribute('aria-label', `选择作品：${project.title}`);
  const thumb = document.createElement('img');
  thumb.className = 'work-card-thumb'; thumb.src = project.thumb; thumb.alt = project.title;
  thumb.decoding = 'async'; thumb.draggable = false;
  const cover = document.createElement('img');
  cover.className = 'work-card-cover'; cover.alt = ''; cover.decoding = 'async'; cover.draggable = false;
  element.append(thumb, cover);
  let video = null;
  if (project.videoPreview) {
    video = document.createElement('video');
    video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'none';
    video.setAttribute('aria-hidden', 'true'); element.append(video);
  }
  const hint = document.createElement('span');
  hint.className = 'work-card-hint'; hint.innerHTML = window.PORTFOLIO_UI.bilingual('点击预览', 'CLICK TO PREVIEW'); element.append(hint);
  return { element, thumb, cover, video, project };
}
export function createDeckAssets(cards) {
  let current = -1, playing = false;
  const events = new AbortController();
  cards.forEach(card => {
    card.cover.addEventListener('load', () => card.cover.classList.add('is-loaded'), { signal: events.signal });
    card.video?.addEventListener('playing', () => {
      if (cards[current] === card && playing) card.element.classList.add('is-playing');
      else card.video.pause();
    }, { signal: events.signal });
  });
  function update(index, shouldPlay = true) {
    current = index; playing = shouldPlay;
    cards.forEach((card, i) => {
      if (Math.abs(i - index) <= 1 && !card.cover.hasAttribute('src')) {
        card.cover.fetchPriority = i === index ? 'high' : 'low'; card.cover.src = card.project.cover;
      }
      if (!card.video) return;
      if (i === index && shouldPlay && !document.hidden) {
        if (!card.video.hasAttribute('src')) card.video.src = card.project.videoPreview;
        card.video.play().catch(() => card.element.classList.remove('is-playing'));
      } else {
        card.video.pause(); if (card.video.readyState) card.video.currentTime = 0;
        card.element.classList.remove('is-playing');
      }
    });
  }
  document.addEventListener('visibilitychange', () => update(current, playing), { signal: events.signal });
  return { update, destroy() { update(-1, false); events.abort(); } };
}

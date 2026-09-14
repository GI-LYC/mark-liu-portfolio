const { profile, projects } = window.PORTFOLIO_DATA;

const page = document.body.dataset.page;
const escapeText = text => String(text ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
function bilingual(zh, en = '') {
  return `<span class="bilingual"><span class="ui-zh">${escapeText(zh)}</span>${en ? `<small class="ui-en" lang="en">${escapeText(en)}</small>` : ''}</span>`;
}
function projectTitle(project) { return bilingual(project.titleZh || project.title, project.titleEn); }
window.PORTFOLIO_UI = { bilingual, projectTitle };
document.querySelectorAll('[data-ui-zh]').forEach(element => {
  element.innerHTML = bilingual(element.dataset.uiZh, element.dataset.uiEn);
});
const navItems = [
  { id: "home", label: "首页", en: "HOME", href: "index.html" },
  { id: "portfolio", label: "作品集", en: "WORK", href: "portfolio.html" },
  { id: "about", label: "关于我", en: "ABOUT", href: "about.html" },
  { id: "contact", label: "联系", en: "CONTACT", href: "contact.html" }
];

function headerMarkup() {
  const headerItems = navItems;
  const links = headerItems
    .map(
      (item) =>
        `<a class="nav-link ${
          item.id === page || (page === "project" && item.id === "portfolio") ? "is-active" : ""
        }" href="${item.href}">${bilingual(item.label, item.en)}</a>`
    )
    .join("");
  return `
    <header class="site-header" data-header>
      <a class="brand" href="index.html" aria-label="刘奕辰 Mark 首页">
        ${bilingual(profile.nameZh, profile.nameEn)}
      </a>
      <button class="menu-toggle" type="button" aria-label="打开导航菜单" aria-expanded="false" aria-controls="site-navigation">
        <span></span><span></span>
      </button>
      <nav class="site-navigation" id="site-navigation">${links}</nav>
    </header>`;
}

function footerMarkup() {
  return `
    <footer class="site-footer">
      <div class="footer-signature">
        <span class="eyebrow">${bilingual('项目合作', 'PROJECT INQUIRY')}</span>
        <p>汽车视觉 / AIGC 内容 / TVC 关键视觉</p>
      </div>
      <a class="footer-mail" href="mailto:${profile.email}"><span class="footer-mail-label">${bilingual('发送邮件', 'SEND EMAIL')}</span>${profile.email}</a>
      <p class="copyright">© ${new Date().getFullYear()} ${escapeText(profile.nameZh)} · ${bilingual('保留所有权利', 'ALL RIGHTS RESERVED')}</p>
    </footer>`;
}

function projectLink(project) {
  return `project.html?id=${project.id}`;
}

function projectCard(project, className = "") {
  return `
    <a class="project-card ${className}" href="${projectLink(project)}">
      <figure class="project-cover">
        <img src="${project.cover}" alt="${project.title}" loading="lazy">
      </figure>
      <div class="project-card-copy">
        <div class="project-meta"><span>${project.number}</span><span>${project.brand}</span></div>
        <h3>${projectTitle(project)}</h3>
        <p>${bilingual(project.type, project.typeEn)}</p>
        <span class="arrow-link">${bilingual('查看项目', 'VIEW PROJECT')} <span aria-hidden="true">↗</span></span>
      </div>
    </a>`;
}

function selectedProjectCard(project) {
  const layout = project.homeLayout || "medium";
  const categories = project.homeCategories || ["VISUAL"];
  const hasVideo = project.media.some((media) => media.type === "video");
  const video = project.media.find((media) => media.type === "video");
  const cover = ["hero", "wide", "split"].includes(layout) ? project.wideCover : project.cover;
  const mediaPreview = hasVideo
    ? `<video muted loop playsinline preload="metadata" poster="${cover}" aria-hidden="true">
        <source src="${video.src}" type="video/mp4">
      </video>`
    : "";

  return `
    <a class="selected-project selected-project--${layout}" href="${projectLink(project)}" data-selected-project data-selected-categories="${categories.join("|")}">
      <figure class="selected-project-media">
        <img src="${cover}" alt="${project.title}" loading="lazy">
        ${mediaPreview}
      </figure>
      <div class="selected-project-copy">
        <span class="selected-project-number">${project.number}</span>
        <h3>${projectTitle(project)}</h3>
        <p class="selected-project-category">${bilingual(project.type, project.typeEn)}</p>
        <p class="selected-project-role">${bilingual(project.role, project.roleEn)}</p>
        <p class="selected-project-year">${project.year || ''}</p>
        <span class="selected-project-view">${bilingual('查看项目', 'VIEW PROJECT')} <b aria-hidden="true">↗</b></span>
      </div>
    </a>`;
}

function setupShell() {
  document.querySelector("[data-site-header]").innerHTML = headerMarkup();
  document.querySelector("[data-site-footer]").innerHTML = footerMarkup();
  const portrait = document.querySelector('[data-profile-portrait]');
  if (portrait) portrait.src = profile.portrait;
  const profileName = document.querySelector('[data-profile-name]');
  if (profileName) profileName.innerHTML = bilingual(profile.nameZh, profile.nameEn);
  const profileTitle = document.querySelector('[data-profile-title]');
  if (profileTitle) profileTitle.innerHTML = bilingual(profile.titleZh, profile.titleEn);

  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
  });
  window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 20), {
    passive: true
  });
}

function renderHome() {
  const grid = document.querySelector("[data-home-projects]");
  const filters = [...document.querySelectorAll("button[data-selected-filter]")];
  const selectedIds = [
    "audi-world-cup",
    "geely-ai-story",
    "wuling-reborn",
    "audi-earth-day",
    "audi-seasons",
    "geely-transformation",
    "geely-china-star",
    "wuling-palace"
  ];
  const selectedWorks = selectedIds
    .map((id) => projects.find((project) => project.id === id))
    .filter(Boolean);
  let revealObserver;

  const revealProjects = () => {
    revealObserver?.disconnect();
    if (!("IntersectionObserver" in window)) {
      grid.querySelectorAll("[data-selected-project]").forEach((card) => card.classList.add("is-visible"));
      return;
    }
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -36px 0px" }
    );
    grid.querySelectorAll("[data-selected-project]").forEach((card) => revealObserver.observe(card));
  };

  const paint = (filter) => {
    const shown = filter === "ALL"
      ? selectedWorks
      : selectedWorks.filter((project) => project.homeCategories?.includes(filter));
    grid.classList.add("is-filtering");
    grid.innerHTML = shown.map(selectedProjectCard).join("");
    revealProjects();
    requestAnimationFrame(() => grid.classList.remove("is-filtering"));
  };

  filters.forEach((button) =>
    button.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
      paint(button.dataset.selectedFilter);
    })
  );

  grid.addEventListener("pointerover", (event) => {
    const card = event.target.closest("[data-selected-project]");
    if (!card || !grid.contains(card)) return;
    const video = card.querySelector("video");
    if (!video) return;
    card.classList.add("is-previewing");
    video.currentTime = 0;
    video.play().catch(() => card.classList.remove("is-previewing"));
  });

  grid.addEventListener("pointerout", (event) => {
    const card = event.target.closest("[data-selected-project]");
    if (!card || card.contains(event.relatedTarget)) return;
    const video = card.querySelector("video");
    if (!video) return;
    card.classList.remove("is-previewing");
    video.pause();
    video.currentTime = 0;
  });

  paint("ALL");
}

function renderPortfolio() {
  const filters = [...document.querySelectorAll("[data-filter]")];
  const grid = document.querySelector("[data-portfolio-grid]");
  const paint = (filter) => {
    const shown = filter === "ALL" ? projects : projects.filter((project) => project.brand === filter);
    grid.innerHTML = shown.map((project) => projectCard(project, "masonry-card")).join("");
  };
  filters.forEach((button) =>
    button.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
      paint(button.dataset.filter);
    })
  );
  paint("ALL");
}

function mediaMarkup(media) {
  const orientationClass = media.orientation ? ` media-${media.orientation}` : "";
  if (media.type === "video") {
    return `
      <figure class="detail-media media-video${orientationClass}">
        <video controls preload="metadata" poster="${media.poster}" playsinline aria-label="${media.alt}">
          <source src="${media.src}" type="video/mp4">
        </video>
        <figcaption>${media.alt}</figcaption>
      </figure>`;
  }
  return `
    <figure class="detail-media${orientationClass}">
      <button class="zoom-image" type="button" data-lightbox-src="${media.src}" data-lightbox-alt="${media.alt}">
        <img src="${media.src}" alt="${media.alt}" loading="lazy">
      </button>
      <figcaption>${media.alt}<a href="${media.src}" target="_blank" rel="noreferrer">${bilingual('原始尺寸', 'FULL SIZE')}</a></figcaption>
    </figure>`;
}

function setupLightbox() {
  const dialog = document.querySelector("[data-lightbox]");
  if (!dialog) return;
  const image = dialog.querySelector("img");
  const caption = dialog.querySelector("p");
  document.querySelectorAll("[data-lightbox-src]").forEach((button) => {
    button.addEventListener("click", () => {
      image.src = button.dataset.lightboxSrc;
      image.alt = button.dataset.lightboxAlt;
      caption.textContent = button.dataset.lightboxAlt;
      dialog.showModal();
    });
  });
  dialog.querySelector("button").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

function setupGalleryCarousel() {
  const track = document.querySelector("[data-gallery-track]");
  if (!track) return;
  document.querySelectorAll("[data-gallery-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.galleryScroll === "next" ? 1 : -1;
      track.scrollBy({ left: direction * track.clientWidth * 0.86, behavior: "smooth" });
    });
  });
}

function renderProject() {
  const selectedId = new URLSearchParams(window.location.search).get("id");
  const project = projects.find((item) => item.id === selectedId) || projects[0];
  document.title = `${project.titleZh || project.title} | ${profile.nameZh}`;
  document.querySelector("[data-project-brand]").textContent = `${project.number} / ${project.brand}`;
  document.querySelector("[data-project-title]").innerHTML = projectTitle(project);
  document.querySelector("[data-project-type]").innerHTML = bilingual(project.type, project.typeEn);
  document.querySelector("[data-project-summary]").textContent = project.summary;
  document.querySelector("[data-project-role]").innerHTML = bilingual(project.role, project.roleEn);
  const heroImage = document.querySelector("[data-project-cover]");
  heroImage.src = project.wideCover;
  heroImage.alt = project.title;
  heroImage.classList.toggle("is-contained", project.coverFit === "contain");
  document.querySelector("[data-project-services]").innerHTML = project.services
    .map((service) => `<li>${service}</li>`)
    .join("");
  const mediaContainer = document.querySelector("[data-project-media]");
  const useCarousel = project.galleryLayout === "carousel";
  mediaContainer.classList.toggle("gallery-carousel", useCarousel);
  if (useCarousel) {
    const images = project.media.filter((media) => media.type !== "video");
    const videos = project.media.filter((media) => media.type === "video");
    mediaContainer.innerHTML = `
      <div class="gallery-carousel-head">
        <p class="eyebrow">${bilingual('滑动浏览作品', 'VISUAL SCROLL')}</p>
        <div class="gallery-controls" aria-label="滑动浏览控制">
          <button type="button" data-gallery-scroll="prev" aria-label="上一个作品">← ${bilingual('上一个', 'PREVIOUS')}</button>
          <button type="button" data-gallery-scroll="next" aria-label="下一个作品">${bilingual('下一个', 'NEXT')} →</button>
        </div>
      </div>
      <div class="gallery-track" data-gallery-track>
        ${images.map(mediaMarkup).join("")}
      </div>
      <div class="gallery-video-list">
        ${videos.map(mediaMarkup).join("")}
      </div>`;
  } else {
    mediaContainer.innerHTML = project.media.map(mediaMarkup).join("");
  }

  const currentIndex = projects.indexOf(project);
  const next = projects[(currentIndex + 1) % projects.length];
  const nextLink = document.querySelector("[data-next-project]");
  nextLink.href = projectLink(next);
  nextLink.querySelector("strong").innerHTML = projectTitle(next);
  nextLink.querySelector(":scope > span").textContent = next.brand;
  setupGalleryCarousel();
  setupLightbox();
}

function initReveal() {
  const nodes = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -24px 0px" }
  );
  nodes.forEach((node) => observer.observe(node));
}

setupShell();
if (page === "home") renderHome();
if (page === "portfolio") renderPortfolio();
if (page === "project") renderProject();
initReveal();

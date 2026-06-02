const { profile, projects } = window.PORTFOLIO_DATA;

const page = document.body.dataset.page;
const navItems = [
  { id: "home", label: "首页", href: "index.html" },
  { id: "portfolio", label: "作品集", href: "portfolio.html" },
  { id: "about", label: "关于我", href: "about.html" },
  { id: "contact", label: "联系", href: "contact.html" }
];

function headerMarkup() {
  const links = navItems
    .map(
      (item) =>
        `<a class="nav-link ${
          item.id === page || (page === "project" && item.id === "portfolio") ? "is-active" : ""
        }" href="${item.href}">${item.label}</a>`
    )
    .join("");
  return `
    <header class="site-header" data-header>
      <a class="brand" href="index.html" aria-label="刘奕辰 Mark 首页">
        <span class="brand-mark">M</span>
        <span class="brand-copy">MARK LIU<small>AI VISUAL DESIGN</small></span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation">
        <span></span><span></span>
      </button>
      <nav class="site-navigation" id="site-navigation">${links}</nav>
    </header>`;
}

function footerMarkup() {
  return `
    <footer class="site-footer">
      <div class="footer-signature">
        <span class="eyebrow">AVAILABLE FOR SELECT PROJECTS</span>
        <p>汽车视觉 / AIGC 内容 / TVC 关键视觉</p>
      </div>
      <a class="footer-mail" href="mailto:${profile.email}">${profile.email}</a>
      <p class="copyright">© ${new Date().getFullYear()} ${profile.name}. All rights reserved.</p>
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
        <h3>${project.title}</h3>
        <p>${project.type}</p>
        <span class="arrow-link">查看项目 <span>↗</span></span>
      </div>
    </a>`;
}

function setupShell() {
  document.querySelector("[data-site-header]").innerHTML = headerMarkup();
  document.querySelector("[data-site-footer]").innerHTML = footerMarkup();

  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 20), {
    passive: true
  });
}

function renderHome() {
  document.querySelector("[data-hero-image]").src = window.PORTFOLIO_DATA.heroCover || projects[0].wideCover;
  document.querySelector("[data-featured-project]").href = projectLink(projects[0]);
  document.querySelector("[data-home-projects]").innerHTML = projects
    .slice(0, 3)
    .map((project) => projectCard(project))
    .join("");
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
      <figcaption>${media.alt}<a href="${media.src}" target="_blank" rel="noreferrer">原始尺寸</a></figcaption>
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
  document.title = `${project.title} | ${profile.name}`;
  document.querySelector("[data-project-brand]").textContent = `${project.number} / ${project.brand}`;
  document.querySelector("[data-project-title]").textContent = project.title;
  document.querySelector("[data-project-type]").textContent = project.type;
  document.querySelector("[data-project-summary]").textContent = project.summary;
  document.querySelector("[data-project-role]").textContent = project.role;
  const heroImage = document.querySelector("[data-project-cover]");
  heroImage.src = project.wideCover;
  heroImage.alt = project.title;
  document.querySelector("[data-project-services]").innerHTML = project.services
    .map((service) => `<li>${service}</li>`)
    .join("");
  const mediaContainer = document.querySelector("[data-project-media]");
  const useCarousel = project.id === "audi-seasons";
  mediaContainer.classList.toggle("gallery-carousel", useCarousel);
  if (useCarousel) {
    const images = project.media.filter((media) => media.type !== "video");
    const videos = project.media.filter((media) => media.type === "video");
    mediaContainer.innerHTML = `
      <div class="gallery-carousel-head">
        <p class="eyebrow">VISUAL SCROLL</p>
        <div class="gallery-controls" aria-label="滑动浏览控制">
          <button type="button" data-gallery-scroll="prev" aria-label="向左浏览">←</button>
          <button type="button" data-gallery-scroll="next" aria-label="向右浏览">→</button>
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
  nextLink.querySelector("strong").textContent = next.title;
  nextLink.querySelector("span").textContent = next.brand;
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
    { threshold: 0.12 }
  );
  nodes.forEach((node) => observer.observe(node));
}

setupShell();
if (page === "home") renderHome();
if (page === "portfolio") renderPortfolio();
if (page === "project") renderProject();
initReveal();

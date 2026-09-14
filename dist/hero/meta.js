export function createArchiveMeta(root, projects) {
  const find = (name) => root.querySelector(`[data-archive-${name}]`);
  const title = find("project-title"), brand = find("brand"), category = find("category");
  const view = find("view"), meta = find("meta"), identity = find("identity"), caption = find("caption");
  const counter = find("current"), select = find("select"), status = find("status");
  const prompt = find("prompt"), environment = find("environment");
  find("total").textContent = String(projects.length).padStart(2, "0");
  projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = String(project.index);
    option.textContent = `${String(project.index + 1).padStart(2, "0")} / ${project.brand} / ${project.title}`;
    select.append(option);
  });
  let previousIndex = -1;
  return {
    render(state) {
      const project = projects[state.index];
      if (!project) return;
      if (previousIndex !== state.index) {
        title.textContent = project.title; brand.textContent = project.brand;
        category.textContent = [project.category, project.year].filter(Boolean).join(" / ");
        view.href = project.url; view.setAttribute("aria-label", "查看项目：" + project.title);
        counter.textContent = String(state.index + 1).padStart(2, "0");
        status.textContent = `项目 ${state.index + 1}，共 ${projects.length}：${project.title}`;
        environment.style.backgroundColor = project.accent;
        previousIndex = state.index;
      }
      select.value = state.strength > .5 ? String(state.index) : "-1";
      meta.style.opacity = String(state.meta); meta.style.transform = `translateY(${(1 - state.meta) * 18}px)`;
      meta.inert = state.meta < .5; meta.setAttribute("aria-hidden", String(state.meta < .5));
      identity.style.opacity = String(1 - state.strength * .92); caption.style.opacity = String(1 - state.meta);
      prompt.textContent = state.position > projects.length + .5 ? "CONTINUE TO EXPLORE" : state.strength > .8 ? "SCROLL FOR NEXT WORK" : "SCROLL TO EXPLORE";
      root.dataset.activeIndex = String(state.index); root.dataset.archivePosition = state.position.toFixed(3);
      root.dataset.archivePhase = state.strength > .98 ? "selected" : state.strength < .02 ? "idle" : "extracting";
    }
  };
}

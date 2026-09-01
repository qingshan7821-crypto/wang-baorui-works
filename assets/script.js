(function () {
  "use strict";

  const config = window.PORTFOLIO_CONFIG;
  const buildPlayerUrl = window.buildBilibiliPlayerUrl;
  if (!config || !buildPlayerUrl) return;

  const { profile, works } = config;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const resolveAsset = (path) => new URL(path, document.baseURI).href;
  const formatIndex = (index) => String(index + 1).padStart(2, "0");

  document.querySelectorAll("[data-profile-name]").forEach((node) => {
    node.textContent = profile.name;
  });
  document.querySelectorAll("[data-profile-initials]").forEach((node) => {
    node.textContent = profile.initials;
  });
  document.querySelector("[data-profile-title]").textContent = profile.title;
  document.querySelector("[data-profile-tagline]").textContent = profile.tagline;
  document.querySelector("[data-profile-bio]").textContent = profile.bio;
  document.querySelector("#works-count").textContent = String(works.length).padStart(2, "0");
  document.querySelector("#hero-works-count").textContent = works.length;
  document.querySelector("#copyright-year").textContent = new Date().getFullYear();

  const details = document.querySelector("#about-details");
  profile.details.forEach(({ label, value }) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    details.append(row);
  });

  const experienceList = document.querySelector("#experience-list");
  profile.experience.forEach((experience) => {
    const item = document.createElement("article");
    item.className = "experience-item";

    const period = document.createElement("p");
    period.textContent = experience.period;

    const content = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = experience.company;
    const role = document.createElement("strong");
    role.textContent = experience.role;
    const summary = document.createElement("p");
    summary.textContent = experience.summary;
    content.append(title, role, summary);

    item.append(period, content);
    experienceList.append(item);
  });

  const phoneLink = document.querySelector("#phone-link");
  phoneLink.href = `tel:${profile.contact.phone}`;
  document.querySelector("#phone-text").textContent = profile.contact.phone;

  const featured = works.find((work) => work.featured) || works[0];
  const featuredPoster = document.querySelector("#featured-play");
  featuredPoster.style.setProperty("--poster", `url("${resolveAsset(featured.poster)}")`);
  featuredPoster.style.setProperty("--accent", featured.accent);
  document.querySelector("#featured-title").textContent = featured.title;
  document.querySelector("#featured-category").textContent = featured.type;
  document.querySelector("#featured-duration").textContent = featured.duration;
  document.querySelector("#featured-index").textContent = formatIndex(works.indexOf(featured));

  const grid = document.querySelector("#work-grid");
  grid.replaceChildren();
  works.forEach((work, index) => {
    const card = document.createElement("article");
    card.className = "work-card reveal visible";
    card.style.setProperty("--poster", `url("${resolveAsset(work.poster)}")`);
    card.style.setProperty("--accent", work.accent);

    const button = document.createElement("button");
    button.className = "work-card-button";
    button.type = "button";
    button.dataset.workId = work.id;
    button.setAttribute("aria-label", `播放${work.title}`);

    const poster = document.createElement("span");
    poster.className = "work-poster";
    poster.innerHTML = `
      <span class="work-topline">
        <span>FILM ${formatIndex(index)}</span>
        <span>${work.duration}</span>
      </span>
      <span class="work-play" aria-hidden="true">▶</span>
      <span class="work-sprockets" aria-hidden="true"></span>
    `;

    const meta = document.createElement("span");
    meta.className = "work-meta";
    meta.innerHTML = `
      <span>
        <small>${work.type}</small>
        <strong>${work.title}</strong>
      </span>
      <span class="work-year">${work.year}<i>↗</i></span>
    `;

    const summary = document.createElement("span");
    summary.className = "work-summary";
    summary.textContent = work.summary;

    button.append(poster, meta, summary);
    card.append(button);
    grid.append(card);
  });

  const dialog = document.querySelector("#work-dialog");
  const dialogPlayer = document.querySelector("#dialog-player");
  const dialogExternal = document.querySelector("#dialog-external");
  let lastTrigger = null;

  document.addEventListener("click", (event) => {
    const workButton = event.target.closest("[data-work-id]");
    if (!workButton) return;
    const work = works.find((item) => item.id === workButton.dataset.workId);
    if (work) openWork(work, workButton);
  });

  featuredPoster.addEventListener("click", (event) => {
    openWork(featured, event.currentTarget);
  });

  document.querySelector(".dialog-close").addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", resetPlayer);
  dialog.addEventListener("cancel", resetPlayer);

  function openWork(work, trigger) {
    lastTrigger = trigger;
    const index = works.indexOf(work);
    document.querySelector("#dialog-number").textContent = formatIndex(index);
    document.querySelector("#dialog-duration").textContent = work.duration;
    document.querySelector("#dialog-title").textContent = work.title;
    document.querySelector("#dialog-summary").textContent = work.summary;
    document.querySelector("#dialog-role").textContent = work.role;
    document.querySelector("#dialog-type").textContent = work.type;

    const media = document.querySelector("#dialog-media");
    media.style.setProperty("--poster", `url("${resolveAsset(work.poster)}")`);
    media.style.setProperty("--accent", work.accent);
    dialogPlayer.title = `${work.title} — Bilibili 播放器`;
    dialogPlayer.src = buildPlayerUrl(work.bvid);
    dialogExternal.href = `https://www.bilibili.com/video/${work.bvid}`;
    dialog.showModal();
  }

  function closeDialog() {
    dialog.close();
    if (lastTrigger) lastTrigger.focus();
  }

  function resetPlayer() {
    dialogPlayer.src = "about:blank";
  }

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
    document.body.classList.toggle("nav-open", !open);
  });
  nav.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    document.body.classList.remove("nav-open");
  });

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55%" },
  );
  sections.forEach((section) => sectionObserver.observe(section));

  if (!reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));
  } else {
    document.querySelectorAll(".reveal").forEach((node) => node.classList.add("visible"));
  }
})();

(function () {
  "use strict";

  const config = window.PORTFOLIO_CONFIG;
  if (!config) return;

  const { profile, works } = config;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const resolveAsset = (path) => new URL(path, document.baseURI).href;

  document.querySelectorAll("[data-profile-name]").forEach((node) => {
    node.textContent = profile.name;
  });
  document.querySelectorAll("[data-profile-initials]").forEach((node) => {
    node.textContent = profile.initials;
  });
  document.querySelector("[data-profile-tagline]").textContent = profile.tagline;
  document.querySelector("[data-profile-bio]").textContent = profile.bio;

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

  const portrait = document.querySelector("#about-portrait");
  portrait.style.setProperty("--portrait", `url(\"${resolveAsset(profile.portrait)}\")`);

  const resume = document.querySelector("#resume-link");
  resume.href = profile.resume;
  const email = document.querySelector("#email-link");
  email.href = `mailto:${profile.contact.email}`;
  document.querySelector("#email-text").textContent = profile.contact.email;
  document.querySelector("#wechat-text").textContent = profile.contact.wechat;
  const social = document.querySelector("#social-link");
  social.href = profile.contact.socialUrl;
  document.querySelector("#social-label").textContent = profile.contact.socialLabel.toUpperCase();
  document.querySelector("#social-text").textContent = profile.contact.socialText;
  document.querySelector("#copyright-year").textContent = new Date().getFullYear();

  const featured = works.find((work) => work.featured) || works[0];
  const featuredPoster = document.querySelector("#featured-poster");
  featuredPoster.style.setProperty("--poster", `url(\"${resolveAsset(featured.poster)}\")`);
  featuredPoster.style.setProperty("--accent", featured.accent);
  document.querySelector("#featured-title").textContent = featured.title;
  document.querySelector("#featured-category").textContent = "视频作品";
  document.querySelector("#featured-index").textContent = formatIndex(works.indexOf(featured));

  const grid = document.querySelector("#work-grid");
  renderWorks(works);

  function renderWorks(collection) {
    grid.replaceChildren();
    collection.forEach((work) => {
      const originalIndex = works.indexOf(work);
      const card = document.createElement("article");
      card.className = "work-card reveal visible";
      card.style.setProperty("--poster", `url(\"${resolveAsset(work.poster)}\")`);
      card.style.setProperty("--accent", work.accent);

      const button = document.createElement("button");
      button.className = "work-card-button";
      button.type = "button";
      button.dataset.workId = work.id;
      button.setAttribute("aria-label", `查看${work.title}详情`);

      const poster = document.createElement("div");
      poster.className = "work-poster";
      poster.innerHTML = `
        <span class="work-number" aria-hidden="true">${formatIndex(originalIndex)}</span>
        <span class="work-play" aria-hidden="true">▶</span>
        <span class="replace-hint">封面替换位置</span>
      `;

      const meta = document.createElement("div");
      meta.className = "work-meta";
      const titleBlock = document.createElement("div");
      const category = document.createElement("p");
      category.textContent = "视频作品";
      const title = document.createElement("h3");
      title.textContent = work.title;
      titleBlock.append(category, title);
      const arrow = document.createElement("span");
      arrow.className = "work-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
      meta.append(titleBlock, arrow);
      button.append(poster, meta);
      card.append(button);
      grid.append(card);
    });
  }

  const dialog = document.querySelector("#work-dialog");
  const dialogVideo = document.querySelector("#dialog-video");
  const dialogPlaceholder = document.querySelector("#dialog-placeholder");
  let lastTrigger = null;

  document.addEventListener("click", (event) => {
    const workButton = event.target.closest("[data-work-id]");
    if (!workButton) return;
    const work = works.find((item) => item.id === workButton.dataset.workId);
    if (work) openWork(work, workButton);
  });

  document.querySelector("#featured-play").addEventListener("click", (event) => {
    openWork(featured, event.currentTarget);
  });

  document.querySelector(".dialog-close").addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", resetVideo);
  dialog.addEventListener("cancel", resetVideo);

  dialogVideo.addEventListener("loadedmetadata", () => {
    dialogVideo.classList.add("ready");
    dialogPlaceholder.classList.add("hidden");
  });
  dialogVideo.addEventListener("error", () => {
    dialogVideo.classList.remove("ready");
    dialogPlaceholder.classList.remove("hidden");
  });

  function openWork(work, trigger) {
    lastTrigger = trigger;
    const index = works.indexOf(work);
    document.querySelector("#dialog-number").textContent = formatIndex(index);
    document.querySelector("#dialog-video-hint").textContent = work.video;
    document.querySelector("#dialog-title").textContent = work.title;
    document.querySelector("#dialog-summary").textContent = work.summary;
    document.querySelector("#dialog-role").textContent = work.role;
    document.querySelector("#dialog-type").textContent = work.type;

    const media = document.querySelector("#dialog-media");
    media.style.setProperty("--poster", `url(\"${resolveAsset(work.poster)}\")`);
    media.style.setProperty("--accent", work.accent);
    dialogVideo.poster = resolveAsset(work.poster);
    dialogVideo.src = resolveAsset(work.video);
    dialogVideo.load();
    dialog.showModal();
  }

  function closeDialog() {
    dialog.close();
    if (lastTrigger) lastTrigger.focus();
  }

  function resetVideo() {
    dialogVideo.pause();
    dialogVideo.removeAttribute("src");
    dialogVideo.load();
    dialogVideo.classList.remove("ready");
    dialogPlaceholder.classList.remove("hidden");
  }

  function formatIndex(index) {
    return String(index + 1).padStart(2, "0");
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
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));
  } else {
    document.querySelectorAll(".reveal").forEach((node) => node.classList.add("visible"));
  }
})();


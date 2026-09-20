// Renders the home page grids and the project detail page from
// files/site_data.js. Markdown write-ups come from files/content.js (bundled from
// markdown/*.md by bundle_markdown.py) and are rendered with marked.

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

const ICON_EXTERNAL = `<svg class="w-4 h-4 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" d="M14 4h6m0 0v6m0-6L10 14M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4"/></svg>`;
const ICON_CLOCK = `<svg class="w-3.5 h-3.5 inline -mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 7v5l3 2"/></svg>`;

const WAKE_NOTE = "Free hosting sleeps between visits; allow up to a minute for the app to appear.";

// ---------------------------------------------------------------- home page
function renderDashboards(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = window.SITE_DASHBOARDS.map(d => `
    <a href="${escapeHtml(d.url)}" target="_blank" rel="noopener" title="${escapeHtml(WAKE_NOTE)}"
       class="card group flex flex-col p-7">
      <span class="kicker">${escapeHtml(d.project)}</span>
      <span class="block text-xl font-bold text-white group-hover:text-accent mt-2">${escapeHtml(d.title)}</span>
      <span class="text-slate-400 mt-3 flex-grow leading-relaxed">${escapeHtml(d.description)}</span>
      <span class="flex items-center justify-between mt-6 text-sm">
        <span class="font-bold text-accent">Open dashboard ${ICON_EXTERNAL}</span>
        <span class="text-slate-500">${ICON_CLOCK} ~1 min to load</span>
      </span>
    </a>`).join("");
}

function renderProjects(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = window.SITE_PROJECTS.map(p => `
    <a href="project.html?id=${encodeURIComponent(p.id)}" class="card group flex flex-col p-8">
      <span class="kicker">${escapeHtml(p.short)}</span>
      <span class="block text-2xl font-extrabold text-white group-hover:text-accent mt-2 tracking-tight">${escapeHtml(p.title)}</span>
      <span class="text-sm font-medium text-slate-500 mt-1">${escapeHtml(p.subtitle)}</span>
      <span class="text-slate-400 mt-5 leading-relaxed flex-grow">${escapeHtml(p.abstract)}</span>
      <span class="flex flex-wrap gap-2 mt-6">
        ${p.products.map(x => `<span class="text-xs px-3 py-1 rounded-full border border-sky-500/30 text-sky-300 bg-sky-500/10">${escapeHtml(x.title)}</span>`).join("")}
        ${p.repos.map(r => `<span class="text-xs px-3 py-1 rounded-full border border-slate-700 text-slate-400">${escapeHtml(r.label)}</span>`).join("")}
      </span>
      <span class="text-sm font-bold text-accent mt-6">Read about the project →</span>
    </a>`).join("");
}

// ---------------------------------------------------------------- project page
async function renderProjectPage() {
  const body = document.getElementById("markdown-body");
  if (!body) return;
  const id = getQueryParam("id");
  const project = window.SITE_PROJECTS.find(p => p.id === id) || window.SITE_PROJECTS[0];

  document.title = `${project.title} | Jack Monaghan`;
  document.getElementById("hero-kicker").textContent = project.short;
  document.getElementById("hero-title").textContent = project.title;
  document.getElementById("hero-subtitle").textContent = project.subtitle;
  document.getElementById("hero-abstract").textContent = project.abstract;

  const link = (href, label, kind = "ghost", icon = ICON_EXTERNAL, title = "") => `
    <a href="${escapeHtml(href)}" target="_blank" rel="noopener" title="${escapeHtml(title)}"
       class="btn ${kind === "primary" ? "btn-primary" : "btn-ghost"} justify-between text-sm">${escapeHtml(label)} ${icon}</a>`;

  document.getElementById("asset-dashboards").innerHTML = project.products.map(x => `
    <div class="card p-5">
      <p class="font-bold text-white">${escapeHtml(x.title)}</p>
      <p class="text-sm text-slate-400 mt-1 mb-4">${escapeHtml(x.description)}</p>
      <div class="flex flex-col gap-2">
        ${x.url ? link(x.url, "Open dashboard (~1 min)", "primary", ICON_EXTERNAL, WAKE_NOTE) : ""}
        ${x.github ? link(x.github, "Dashboard code") : ""}
      </div>
    </div>`).join("");

  document.getElementById("asset-repos").innerHTML = project.repos.map(r => link(r.url, r.label)).join("");

  document.getElementById("other-projects").innerHTML = window.SITE_PROJECTS.filter(p => p.id !== project.id).map(p => `
    <a href="project.html?id=${encodeURIComponent(p.id)}" class="text-sm font-bold text-accent hover:underline">${escapeHtml(p.title)} →</a>`).join("");

  try {
    // files/content.js (built by bundle_markdown.py) carries the write-ups; fall back to
    // fetching the .md file when it is missing, e.g. right after editing a write-up locally
    const key = project.markdown.replace(/^markdown\//, "").replace(/\.md$/, "");
    let text = (window.SITE_CONTENT || {})[key];
    if (text == null) {
      const res = await fetch(project.markdown);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      text = await res.text();
    }
    body.innerHTML = marked.parse(text);
  } catch (e) {
    body.innerHTML = `<p>${escapeHtml(project.abstract)}</p>
      <p class="text-sm text-slate-500">The full write-up (<code>${escapeHtml(project.markdown)}</code>) could not be loaded.
      When the site is opened from disk the browser blocks this request; it works when served over HTTP
      (GitHub Pages, or <code>python -m http.server</code> in the site folder).</p>`;
  }
}

// ---------------------------------------------------------------- CV modal (home page)
function toggleModal() {
  const modal = document.getElementById("cvModal");
  if (!modal) return;
  modal.classList.toggle("active");
  document.body.style.overflow = modal.classList.contains("active") ? "hidden" : "auto";
}
window.addEventListener("click", e => { if (e.target && e.target.id === "cvModal") toggleModal(); });
window.addEventListener("keydown", e => {
  const modal = document.getElementById("cvModal");
  if (e.key === "Escape" && modal && modal.classList.contains("active")) toggleModal();
});

document.addEventListener("DOMContentLoaded", () => {
  renderDashboards("dashboard-grid");
  renderProjects("project-grid");
  renderProjectPage();
});

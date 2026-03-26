// 1. Shared Global Variables
const projects = ['aoic_probation.md', 'fbi_cde.md', 'idoc.md']; 
const urlParams = new URLSearchParams(window.location.search);
const projectSlug = urlParams.get('p'); 

// 2. The "Gatekeeper" - This runs as soon as the script loads
document.addEventListener('DOMContentLoaded', () => {
    
    // Check if we are on the Home Page
    const projectGrid = document.getElementById('project-grid');
    if (projectGrid) {
        renderHomeGrid();
    }

    // Check if we are on the Project Detail Page
    const detailBody = document.getElementById('markdown-body');
    if (detailBody && projectSlug) {
        renderProjectDetail();
    }
});

// 3. Home Page Function
async function renderHomeGrid() {
    const grid = document.getElementById('project-grid');
    for (const file of projects) {
        const response = await fetch(`markdown/${file}`);
        const text = await response.text();
        const title = text.match(/title: "(.*)"/)[1];
        const abstract = text.match(/abstract: "(.*)"/)[1];
        const slug = file.replace('.md', '');

        grid.innerHTML += `
            <a href="project_detail.html?p=${slug}" class="bg-blue-200 p-8 rounded-2xl text-white shadow-lg block hover:scale-[1.02] transition-transform">
                <h3 class="text-gray-700 font-bold uppercase">${title}</h3>
                <p class="text-gray-600">${abstract}</p>
            </a>`;
    }
}

// 4. Project Detail Function
async function renderProjectDetail() {
    
    // 1. Fetch the file
    const res = await fetch(`markdown/${projectSlug}.md`);
    const raw = await res.text();

    // 2. The Regex "Surgical Strike"
    // This finds everything between the first and second ---
    const metaMatch = raw.match(/^---\s*([\s\S]*?)\s*---/);
    const meta = metaMatch ? metaMatch[1] : "";
    
    // This finds everything AFTER the second ---
    const content = raw.replace(/^---\s*[\s\S]*?\s*---/, "").trim();

    // 3. Update the UI 
    // We use a small helper to prevent "null" errors
    const getField = (regex) => {
        const match = meta.match(regex);
        return match ? match[1] : "#"; // Default to '#' if missing
    };

    document.getElementById('hero-title').innerText = getField(/title:\s*"(.*)"/);
    document.getElementById('pipe-link').href = getField(/pipeline_github:\s*"(.*)"/);
    document.getElementById('dash-link').href = getField(/dashboard_github:\s*"(.*)"/);
    document.getElementById('embedded-dashboard').src = getField(/dashboard_url:\s*"(.*)"/);

    // 4. Inject the Markdown body
    document.getElementById('markdown-body').innerHTML = marked.parse(content);
}
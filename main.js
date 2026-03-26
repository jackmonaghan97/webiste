// 1. Shared Global Variables
const projects = ['test.md', 'test copy.md']; 
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
            <a href="project_detail.html?p=${slug}" class="bg-blue-600 p-8 rounded-2xl text-white shadow-lg block hover:scale-[1.02] transition-transform">
                <h3 class="text-2xl font-bold mb-3">${title}</h3>
                <p class="text-blue-100">${abstract}</p>
            </a>`;
    }
}

async function renderProjectDetail() {
    const grid = document.getElementById('project-grid');
    for (const file of projects) {
        const response = await fetch(`markdown/${file}`);
        const text = await response.text();
        const title = text.match(/title: "(.*)"/)[1];
        const abstract = text.match(/abstract: "(.*)"/)[1];
        const slug = file.replace('.md', '');

        grid.innerHTML += `
            <a href="project_detail.html?p=${slug}" class="bg-blue-600 p-8 rounded-2xl text-white shadow-lg block hover:scale-[1.02] transition-transform">
                <h3 class="text-2xl font-bold mb-3">${title}</h3>
                <p class="text-blue-100">${abstract}</p>
            </a>`;
    }
} 
    
    
    
    try {
        const res = await fetch(`markdown/${projectSlug}.md`);
        if (!res.ok) throw new Error("Markdown file not found");
        
        const raw = await res.text();
        
        // This regex extracts everything between the first two sets of ---
        const metaMatch = raw.match(/^---\s*([\s\S]*?)\s*---/);
        const meta = metaMatch ? metaMatch[1] : "";
        const content = raw.replace(/^---\s*[\s\S]*?\s*---/, "");

        // Helper function: Safely finds a variable or returns an empty string
        const getMeta = (key) => {
            const regex = new RegExp(`${key}:\\s*"(.*)"`);
            const match = meta.match(regex);
            return match ? match[1] : ""; 
        };

        // Update the UI - Use the IDs exactly as they appear in your HTML
        document.getElementById('hero-title').innerText = getMeta('title');
        document.getElementById('pipe-link').href = getMeta('pipeline_github');
        document.getElementById('dash-link').href = getMeta('dashboard_github');
        document.getElementById('embedded-dashboard').src = getMeta('dashboard_url');

        // Render the body text using the marked library
        document.getElementById('markdown-body').innerHTML = marked.parse(content);
        
    } catch (err) {
        console.error("Detail load error:", err);
        document.getElementById('markdown-body').innerHTML = "<p>Project content could not be loaded.</p>";
    }
}
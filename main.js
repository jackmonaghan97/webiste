// Fetch and parse JSON
async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`Failed to load ${path}:`, e);
    return [];
  }
}

// HTML escaper
function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// render grid
function renderGrid(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const fragment = document.createDocumentFragment();

  for (const item of items || []) {
    if (!item) continue;

    const link = document.createElement('a');
    // Match your "Work Products" card style
    link.className =
      'bg-blue-50 p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group';

    // Use URL + target from JSON
    link.href = item.url || '#';
    link.target = item.target || '_self';

    link.innerHTML = `
      <span class="block text-sm font-bold text-gray-900 group-hover:text-blue-600">
        ${escapeHtml(item.title || '')}
      </span>
      <span class="text-xs text-gray-500">
        ${escapeHtml(item.subtitle || item.project || '')}
      </span>
    `;

    fragment.appendChild(link);
  }

  container.appendChild(fragment);
}

// Get URL parameter
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

document.addEventListener('DOMContentLoaded', async () => {
  
  console.log('Script started');
  
  if (document.getElementById('product-grid')) {
    console.log('Fetching datasets...');
    
    const datasets = await fetchJSON('files/products.json');
    console.log('Products loaded:', datasets);
    
    // Use the JSON data directly (no markdown fetching needed)
    renderGrid('product-grid', datasets.map(item => ({
      slug: item.id,
      title: item.title,
      subtitle: item.abstract || item.subtitle || 'No description available'
    })));
  }

  if (document.getElementById('product-grid')) {
    console.log('Fetching datasets...');
    
    const datasets = await fetchJSON('files/products.json');
    console.log('Products loaded:', datasets);
    
    // Use the JSON data directly (no markdown fetching needed)
    renderGrid('product-grid', datasets.map(item => ({
      slug: item.id,
      title: item.title,
      abstract: item.abstract || item.subtitle || 'No description available'
    })));
  }

  // Project detail page code stays the same...
});
async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`Failed to load ${path}:`, e);
    return null;
  }
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function createDatasetCard(dataset) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow';
  
  card.innerHTML = `
    <div class="mb-4">
      <h3 class="text-xl font-bold text-gray-900 mb-2">${escapeHtml(dataset.title)}</h3>
      <p class="text-gray-600 mb-4">${escapeHtml(dataset.abstract)}</p>
    </div>
    
    <div class="flex items-center justify-between">
      <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">${escapeHtml(dataset.tags?.[0] || 'dataset')}</span>
      <a href="${escapeHtml(dataset.url)}" 
         target="${dataset.target || '_blank'}" 
         class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium">
        Download
      </a>
    </div>
  `;
  
  return card;
}

function renderDatasets(datasets) {
  const container = document.getElementById('datasets-list');
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  
  // Hide loading
  loading.style.display = 'none';
  
  if (!datasets || datasets.length === 0) {
    error.style.display = 'block';
    error.innerHTML = '<p class="text-gray-500">No datasets found.</p>';
    return;
  }
  
  // Clear container and add datasets
  container.innerHTML = '';
  datasets.forEach(dataset => {
    const card = createDatasetCard(dataset);
    container.appendChild(card);
  });
  
  container.style.display = 'grid';
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Loading datasets page...');
  
  const datasets = await fetchJSON('files/datasets.json');
  console.log('Datasets loaded:', datasets);
  
  renderDatasets(datasets);
});

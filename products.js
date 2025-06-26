let allProducts = [];
let categories = new Set();
let subcategories = new Set();

// Fetch products.json and initialize
fetch('products.json')
  .then(res => res.json())
  .then(products => {
    allProducts = products;
    // Populate category and subcategory filters
    products.forEach(p => {
      categories.add(p.category);
      subcategories.add(p.subcategory);
    });
    populateFilters();
    renderProducts(products);
  });

// Populate filter dropdowns
function populateFilters() {
  const catSelect = document.getElementById('category-filter');
  const subcatSelect = document.getElementById('subcategory-filter');
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    catSelect.appendChild(opt);
  });
  subcategories.forEach(subcat => {
    const opt = document.createElement('option');
    opt.value = subcat;
    opt.textContent = subcat;
    subcatSelect.appendChild(opt);
  });
}

// Render products
function renderProducts(products) {
  const container = document.getElementById('product-list');
  const noResults = document.getElementById('no-results');
  container.innerHTML = '';
  if (products.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');
  products.forEach(product => {
    container.innerHTML += `
      <div class="bg-white rounded-2xl shadow p-4 flex flex-col">
        <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover rounded mb-3">
        <h3 class="font-bold text-lg mb-1">${product.name}</h3>
        <div class="text-xs text-gray-600 mb-1">${product.category} > ${product.subcategory}</div>
        <div class="text-[#588157] font-semibold mb-2">Rs. ${product.price.toLocaleString()}</div>
        <p class="text-xs mb-2">${product.description}</p>
        <div class="flex flex-wrap gap-1 mb-2">
          ${product.tags.map(tag => `<span class="bg-[#f5f5dc] text-[#bfa181] text-xs px-2 py-0.5 rounded">${tag}</span>`).join('')}
        </div>
        <ul class="text-xs text-gray-500 list-disc pl-4">
          ${product.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
    `;
  });
}

// Filtering logic
function filterProducts() {
  const search = document.getElementById('search').value.toLowerCase();
  const cat = document.getElementById('category-filter').value;
  const subcat = document.getElementById('subcategory-filter').value;
  let filtered = allProducts.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      (p.tags && p.tags.some(tag => tag.toLowerCase().includes(search)));
    const matchesCat = !cat || p.category === cat;
    const matchesSubcat = !subcat || p.subcategory === subcat;
    return matchesSearch && matchesCat && matchesSubcat;
  });
  renderProducts(filtered);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search').addEventListener('input', filterProducts);
  document.getElementById('category-filter').addEventListener('change', filterProducts);
  document.getElementById('subcategory-filter').addEventListener('change', filterProducts);
});
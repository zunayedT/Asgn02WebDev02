import { showProduct } from "./productView.js";
import { showView } from "../app.js";

// STATE (filters)
let allProducts = [];
let filtered = [];

let filters = {
    gender: null,
    category: null,
    size: null,
    color: null,
    search: "",
    sort: "nameAZ"
};

export function showBrowse(products) {
    allProducts = products;

    const browse = document.getElementById("browse");

    browse.innerHTML = `
        <section class="max-w-7xl mx-auto py-8 px-4">

            <h1 class="text-3xl font-bold mb-6">Browse Products</h1>

            <!-- FILTERS BAR -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

                <!-- Gender -->
                <div>
                    <h2 class="font-semibold mb-2">Gender</h2>
                    <button class="filter-btn" data-gender="womens">Women</button>
                    <button class="filter-btn" data-gender="mens">Men</button>
                    <button class="filter-btn" data-gender="">All</button>
                </div>

                <!-- Category -->
                <div>
                    <h2 class="font-semibold mb-2">Category</h2>
                    <select id="categoryFilter" class="border px-2 py-1 rounded w-full">
                        <option value="">All</option>
                        <option value="Tops">Tops</option>
                        <option value="Bottoms">Bottoms</option>
                        <option value="Dresses">Dresses</option>
                        <option value="Outerwear">Outerwear</option>
                    </select>
                </div>

                <!-- Size -->
                <div>
                    <h2 class="font-semibold mb-2">Size</h2>
                    <select id="sizeFilter" class="border px-2 py-1 rounded w-full">
                        <option value="">All</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </div>

                <!-- Color -->
                <div>
                    <h2 class="font-semibold mb-2">Color</h2>
                    <select id="colorFilter" class="border px-2 py-1 rounded w-full">
                        <option value="">All</option>
                        <option value="Ivory">Ivory</option>
                        <option value="Black">Black</option>
                        <option value="Blue">Blue</option>
                        <option value="Red">Red</option>
                    </select>
                </div>

            </div>

            <!-- Search + Sort -->
            <div class="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">

                <input 
                    id="searchInput"
                    type="text"
                    placeholder="Search products..."
                    class="w-full md:w-1/3 border px-3 py-2 rounded"
                />

                <select id="sortSelect" class="border px-3 py-2 rounded">
                    <option value="nameAZ">Name (A → Z)</option>
                    <option value="nameZA">Name (Z → A)</option>
                    <option value="priceLowHigh">Price (Low → High)</option>
                    <option value="priceHighLow">Price (High → Low)</option>
                </select>

            </div>

            <!-- Filters Active Chips -->
            <div id="activeFilters" class="flex flex-wrap gap-3 mt-4"></div>

            <!-- Clear All -->
            <button id="clearFilters" class="mt-3 text-sm text-blue-600 underline">
                Clear All Filters
            </button>

            <!-- Results -->
            <h2 class="text-xl font-semibold mt-8">Results</h2>
            <div id="resultsGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4"></div>

        </section>
    `;

    // Event Listeners
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            filters.gender = btn.dataset.gender || null;
            applyFilters();
        });
    });

    document.getElementById("categoryFilter").addEventListener("change", e => {
        filters.category = e.target.value || null;
        applyFilters();
    });

    document.getElementById("sizeFilter").addEventListener("change", e => {
        filters.size = e.target.value || null;
        applyFilters();
    });

    document.getElementById("colorFilter").addEventListener("change", e => {
        filters.color = e.target.value || null;
        applyFilters();
    });

    document.getElementById("searchInput").addEventListener("input", e => {
        filters.search = e.target.value.toLowerCase();
        applyFilters();
    });

    document.getElementById("sortSelect").addEventListener("change", e => {
        filters.sort = e.target.value;
        applyFilters();
    });

    document.getElementById("clearFilters").addEventListener("click", () => {
        filters = {
            gender: null,
            category: null,
            size: null,
            color: null,
            search: "",
            sort: "nameAZ"
        };
        showBrowse(products);
    });

    applyFilters();
}

/* ----------------------------
    APPLY FILTERS + RENDER LIST
------------------------------*/
function applyFilters() {
    filtered = allProducts.filter(p => {
        if (filters.gender && p.gender !== filters.gender) return false;
        if (filters.category && p.category !== filters.category) return false;
        if (filters.size && !p.sizes.includes(filters.size)) return false;
        if (filters.color && !p.color.some(c => c.name === filters.color)) return false;
        if (filters.search && !p.name.toLowerCase().includes(filters.search)) return false;
        return true;
    });

    if (filters.sort === "nameAZ") filtered.sort((a,b)=> a.name.localeCompare(b.name));
    if (filters.sort === "nameZA") filtered.sort((a,b)=> b.name.localeCompare(a.name));
    if (filters.sort === "priceLowHigh") filtered.sort((a,b)=> a.price - b.price);
    if (filters.sort === "priceHighLow") filtered.sort((a,b)=> b.price - a.price);

    renderFiltersChips();
    renderResults();
}

/* ----------------------------
     FILTER CHIPS
------------------------------*/
function renderFiltersChips() {
    const box = document.getElementById("activeFilters");
    box.innerHTML = "";

    const entries = [
        ["Gender", filters.gender],
        ["Category", filters.category],
        ["Size", filters.size],
        ["Color", filters.color],
        ["Search", filters.search]
    ];

    entries.forEach(([label, value]) => {
        if (value) {
            const chip = document.createElement("span");
            chip.className = "px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm";
            chip.textContent = `${label}: ${value}`;
            box.appendChild(chip);
        }
    });
}

/* ----------------------------
     RESULTS GRID
------------------------------*/
function renderResults() {
    const grid = document.getElementById("resultsGrid");
    grid.innerHTML = "";

    if (filtered.length === 0) {
        grid.innerHTML = `<p>No matching products found.</p>`;
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer";

        const btnId = `view-${p.id}`;

        card.innerHTML = `
            <div class="h-40 bg-gray-100 rounded flex items-center justify-center mb-3">
                <span class="text-gray-400 text-xs">Image Placeholder</span>
            </div>
            <h3 class="font-semibold text-lg">${p.name}</h3>
            <p class="text-gray-600">${p.category}</p>
            <p class="font-bold mt-1">$${p.price}</p>

            <button id="${btnId}" class="mt-3 text-sm text-blue-600 underline">
                View
            </button>
        `;

        grid.appendChild(card);

        document.getElementById(btnId).addEventListener("click", () => {
            console.log("View button clicked for:", p.name);
            showView("singleproduct");
            showProduct(p);
        });
    });
}

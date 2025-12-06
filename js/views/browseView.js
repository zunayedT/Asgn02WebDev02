import { showProduct } from "./productView.js";
import { showView } from "../app.js";
import { addToCart } from "./cartView.js";
//global variable
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

// Expose these so HomeView can set gender and trigger filtering
window.filters = filters;
window.applyFilters = applyFilters;

export function showBrowse(products, genderFromHome = null) {
    allProducts = products;

    if (genderFromHome) {
        filters.gender = genderFromHome;
    }

    const browse = document.getElementById("browse");

    browse.innerHTML = `
        <section>
            <h1 class="page-title">Browse Products</h1>

            <!-- FILTERS -->
            <div class="filter-panel">

                <div>
                    <h3>Gender</h3>
                    <button class="btn filter-btn" data-gender="womens">Women</button>
                    <button class="btn filter-btn" data-gender="mens">Men</button>
                    <button class="btn filter-btn" data-gender="">All</button>
                </div>

                <div>
                    <h3>Category</h3>
                    <select id="categoryFilter">
                        <option value="">All</option>
                        <option value="Tops">Tops</option>
                        <option value="Bottoms">Bottoms</option>
                        <option value="Dresses">Dresses</option>
                        <option value="Outerwear">Outerwear</option>
                    </select>
                </div>

                <div>
                    <h3>Size</h3>
                    <select id="sizeFilter">
                        <option value="">All</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </div>

                <div>
                    <h3>Color</h3>
                    <select id="colorFilter">
                        <option value="">All</option>
                        <option value="Ivory">Ivory</option>
                        <option value="Black">Black</option>
                        <option value="Blue">Blue</option>
                        <option value="Red">Red</option>
                    </select>
                </div>
            </div>

            <div class="search-sort">
                <input id="searchInput" type="text" placeholder="Search products...">
                <select id="sortSelect">
                    <option value="nameAZ">Name (A → Z)</option>
                    <option value="nameZA">Name (Z → A)</option>
                    <option value="priceLowHigh">Price (Low → High)</option>
                    <option value="priceHighLow">Price (High → Low)</option>
                </select>
            </div>

            <div id="activeFilters" class="chip-container"></div>
            <button id="clearFilters" class="btn">Clear All</button>

            <h2 class="section-title">Results</h2>
            <div id="resultsGrid" class="grid-4"></div>
        </section>
    `;

    // Event listeners for the items in that view
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
        filters.gender = null;
        filters.category = null;
        filters.size = null;
        filters.color = null;
        filters.search = "";
        filters.sort = "nameAZ";

        showBrowse(products); // Reset page
    });

    applyFilters();
}

//filterrring logic made the code a bit nicer
function applyFilters() {

    filtered = allProducts.filter(p => {
        if (filters.gender && p.gender !== filters.gender) return false;
        if (filters.category && p.category !== filters.category) return false;
        if (filters.size && !p.sizes.includes(filters.size)) return false;
        if (filters.color && !p.color.some(c => c.name === filters.color)) return false;
        if (filters.search && !p.name.toLowerCase().includes(filters.search)) return false;
        return true;
    });

    // Sorting methods
    if (filters.sort === "nameAZ") filtered.sort((a,b)=> a.name.localeCompare(b.name));
    if (filters.sort === "nameZA") filtered.sort((a,b)=> b.name.localeCompare(a.name));
    if (filters.sort === "priceLowHigh") filtered.sort((a,b)=> a.price - b.price);
    if (filters.sort === "priceHighLow") filtered.sort((a,b)=> b.price - a.price);

    renderFiltersChips();
    renderResults();
}

//filter functions for the filter chips
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
        if (!value) return;

        const chip = document.createElement("div");
        chip.className = "chip";
        chip.innerHTML = `
            ${label}: ${value}
            <span class="chip-close">×</span>
        `;

        chip.querySelector(".chip-close").addEventListener("click", () => {
            filters[label.toLowerCase()] = null;
            applyFilters();
        });

        box.appendChild(chip);
    });
}

//showing the result in the grid
function renderResults() {
    const grid = document.getElementById("resultsGrid");
    grid.innerHTML = "";

    if (filtered.length === 0) {
        grid.innerHTML = `<p>No matching products found.</p>`;
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="img-placeholder"></div>
            <h3>${p.name}</h3>
            <p>${p.category}</p>
            <p><strong>$${p.price}</strong></p>
            <button class="btn view-btn">View</button>
            <button class="btn add-btn">Add to Cart</button>
        `;

        // view product
        card.querySelector(".view-btn").addEventListener("click", () => {
            showView("singleproduct");
            showProduct(p);
        });

        // add to cart
        card.querySelector(".add-btn").addEventListener("click", () => {
            addToCart(p, 1);
        });

        grid.appendChild(card);
    });
}

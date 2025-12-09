import { showProduct } from "./productView.js";
import { showView, showToast, createProductCard } from "../app.js";
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

    //populating the category according to our API data
    const categories = [...new Set(products.map(p => p.category))].sort();
    const categorySelect = document.querySelector("#categoryFilter");

    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
    });

    //populating the color with the color options we found in the DATA from the API
    const colors = [
        ...new Set(
            products.flatMap(p => p.color.map(c => c.name))
        )
    ].sort();

    const colorSelect = document.querySelector("#colorFilter");

    colors.forEach(col => {
        const opt = document.createElement("option");
        opt.value = col;
        opt.textContent = col;
        colorSelect.appendChild(opt);
    });
    applyFilters();
}

//filterrring logic made the code a bit nicer
//this is nice Taylor thanks man.
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

    // replaced with new card template
    filtered.forEach(p => {
        const card = createProductCard(p, () => {
                showView("singleproduct");
                showProduct(p);
            },
            () => {  
                addToCart(p, 1);
                showToast("Added to cart!");
            }
        );
        grid.appendChild(card);
    });
}



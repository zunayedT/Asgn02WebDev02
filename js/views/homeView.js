import { showView } from "../app.js";
import { showBrowse } from "./browseView.js";
import { showProduct } from "./productView.js";

export function showHome(products) {

    const home = document.getElementById("home");

    home.innerHTML = `
        <section class="hero">
            <h1>Fashion For Everyone</h1>
            <p>Discover the latest styles in our collection</p>

            <div class="hero-buttons">
                <button id="btnWomen" class="btn">Shop Women</button>
                <button id="btnMen" class="btn-dark">Shop Men</button>
            </div>
        </section>

        <section class="featured">
            <h2>Featured Categories</h2>
            <div class="grid-4">
                <div class="card">Dresses</div>
                <div class="card">Tops</div>
                <div class="card">Bottoms</div>
                <div class="card">Outerwear</div>
            </div>
        </section>

        <section>
            <h2>Featured Products</h2>
            <div id="featuredList" class="grid-3"></div>
        </section>
    `;

    // Women filter
    document.getElementById("btnWomen").addEventListener("click", () => {
        showView("browse");
        showBrowse(products);   // load browse
        window.filters.gender = "womens";  // apply filter
        window.applyFilters();
    });

    // Men filter
    document.getElementById("btnMen").addEventListener("click", () => {
        showView("browse");
        showBrowse(products);
        window.filters.gender = "mens";
        window.applyFilters();
    });

    // Featured products
    const featured = products.slice(0, 3);
    const container = document.getElementById("featuredList");

    featured.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${p.name}</h3>
            <p>${p.category}</p>
            <p>$${p.price}</p>
        `;

        card.addEventListener("click", () => {
            showView("singleproduct");
            showProduct(p);  // pass the actual product object
        });

        container.appendChild(card);
    });
}

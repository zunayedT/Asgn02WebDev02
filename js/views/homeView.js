import { showView, showToast, createProductCard } from "../app.js";
import { showBrowse } from "./browseView.js";
import { showProduct } from "./productView.js";
import { addToCart } from "./cartView.js";


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
                <div class="card category-btn" data-category="Dresses">Dresses</div>
                <div class="card category-btn" data-category="Tops">Tops</div>
                <div class="card category-btn" data-category="Bottoms">Bottoms</div>
                <div class="card category-btn" data-category="Outerwear">Outerwear</div>
            </div>
        </section>

        <section>
            <h2>Featured Products</h2>
            <div id="featuredList" class="grid-3"></div>
        </section>
    `;

    // filtering function for womens clothing item
    document.getElementById("btnWomen").addEventListener("click", () => {
        showView("browse");
        showBrowse(products);   
        window.filters.gender = "womens"; 
        window.applyFilters();
    });

    // filtering function for men
    document.getElementById("btnMen").addEventListener("click", () => {
        showView("browse");
        showBrowse(products);
        window.filters.gender = "mens";
        window.applyFilters();
    });

    // Featured products lets have a crack at it
    const featured = products.slice(0, 3);
    const container = document.getElementById("featuredList");

    
    featured.forEach(p => {
        const card = createProductCard( p,() => {
                showView("singleproduct");
                showProduct(p);
            },
            () => { 
                addToCart(p, 1);
                showToast("Added to cart!");
            }
        );

        container.appendChild(card);
    });

    // features category section handlers
        document.querySelectorAll(".category-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const category = btn.dataset.category;
            showView("browse");
            showBrowse(products);
            window.filters.gender = null;
            window.filters.category = category;
            window.applyFilters();
        });
    });
}

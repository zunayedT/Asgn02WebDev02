import { showView } from "../app.js";
import { showBrowse } from "./browseView.js";
import { showProduct } from "./productView.js";

export function showHome(products) {
    const home = document.getElementById("home");

    home.innerHTML = `
        <section class="w-full bg-gray-100 py-20 px-6 text-center">
            <h1 class="text-5xl font-bold mb-4">Fashion For Everyone</h1>
            <p class="text-lg text-gray-600 mb-8">
                Discover the latest styles in our collection
            </p>

            <div class="flex justify-center gap-6">
                <button id="btnWomen" 
                    class="bg-blue-600 text-white px-8 py-3 rounded-lg 
                           hover:bg-blue-700 transition">
                    Shop Women
                </button>

                <button id="btnMen" 
                    class="bg-gray-800 text-white px-8 py-3 rounded-lg 
                           hover:bg-gray-900 transition">
                    Shop Men
                </button>
            </div>
        </section>

        <section class="px-6 py-14 max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold mb-8 text-center">Featured Categories</h2>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">

                <div class="bg-white p-6 rounded-xl text-center shadow hover:shadow-lg transition">
                    <h3 class="text-xl font-semibold mb-2">Dresses</h3>
                    <p class="text-gray-600">Explore our styles</p>
                </div>

                <div class="bg-white p-6 rounded-xl text-center shadow hover:shadow-lg transition">
                    <h3 class="text-xl font-semibold mb-2">Tops</h3>
                    <p class="text-gray-600">New arrivals</p>
                </div>

                <div class="bg-white p-6 rounded-xl text-center shadow hover:shadow-lg transition">
                    <h3 class="text-xl font-semibold mb-2">Bottoms</h3>
                    <p class="text-gray-600">Comfort & style</p>
                </div>

                <div class="bg-white p-6 rounded-xl text-center shadow hover:shadow-lg transition">
                    <h3 class="text-xl font-semibold mb-2">Outerwear</h3>
                    <p class="text-gray-600">Stay warm</p>
                </div>

            </div>
        </section>

        <section class="px-6 py-14 max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold mb-8 text-center">Featured Products</h2>
            <div id="featuredList" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"></div>
        </section>
    `;

    document.getElementById("btnWomen").addEventListener("click", () => {
        showView("browse");
        showBrowse(products, "women");
    });

    document.getElementById("btnMen").addEventListener("click", () => {
        showView("browse");
        showBrowse(products, "men");
    });

    const featured = products.slice(0, 3);
    const container = document.getElementById("featuredList");

    featured.forEach(p => {
        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer";
        card.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">${p.name}</h3>
            <p class="text-gray-600 capitalize">${p.category}</p>
            <p class="text-gray-800 font-bold mt-2">$${p.price}</p>
        `;
        card.addEventListener("click", () => {
            showView("product");
            showProduct(p.id, products);
        });
        container.appendChild(card);
    });
}

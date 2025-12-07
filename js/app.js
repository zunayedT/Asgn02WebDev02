import { loadProducts } from "./data.js";
import { showHome } from "./views/homeView.js";
import { showBrowse } from "./views/browseView.js";
import { showCart } from "./views/cartView.js";
import { setupAboutDialog } from "./views/aboutDialog.js";
//global variable
let products = [];
//view changing effects
export function showView(viewId) {
    document.querySelectorAll("main article").forEach(a => {
        a.style.display = "none";
    });
    document.getElementById(viewId).style.display = "block";
}

//intial page loading
document.addEventListener("DOMContentLoaded", async () => {

    // 1) Load dataset
    products = await loadProducts();
    console.log("Products loaded:", products);

    // 2) Setup About dialog logic
    setupAboutDialog();

    // 3) Show Home page by default
    showView("home");
    showHome(products);
});

//CARD TEMPLATE
export function createProductCard(product, onView, onAddToCart) {

    const card = document.createElement("div");
    card.className = "card";

    // uses items color hex to create coloured img background
    const primaryColor = product.color[0].hex;

    card.innerHTML = `
        <div class="card-image-wrapper" 
             style="background-color: ${primaryColor}; height: 500px; display:flex; align-items:center; justify-content:center;">
            <img 
                src="images/${product.category}.png" 
                alt="${product.name}" 
                class="card-img"
                style="max-width: 400px; max-height: 400px;">
        </div>
        <h3>${product.name}</h3>
        <p>${product.category}</p>
        <p><strong>$${product.price.toFixed(2)}</strong></p>
        <button class="btn add-btn">Add to Cart</button>
    `;

    // allows whole card to be clickable instead of "view" button
    card.addEventListener("click", () => {
        onView();
    });

    // add-to-cart button
    const addBtn = card.querySelector(".add-btn");
    addBtn.addEventListener("click", () => {
        onAddToCart();
    });

    return card;
}

//TOAST FUNCTION
export function showToast(message) {
    const toast = document.querySelector('#toast');

    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
        toast.classList.add('hidden');
    }, 2000);
}


// HOME
document.getElementById("navHome").addEventListener("click", () => {
    showView("home");
    showHome(products);
});

// BROWSE
document.getElementById("navBrowse").addEventListener("click", () => {
    showView("browse");
    showBrowse(products);
});

// CART
document.getElementById("navCart").addEventListener("click", () => {
    showView("cart");
    showCart();
});

// ABOUT
document.getElementById("navAbout").addEventListener("click", () => {
    document.getElementById("about").showModal();
});

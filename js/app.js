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

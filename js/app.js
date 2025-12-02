//importing view modules from view.
import { showHome } from "./views/homeView.js";
import { showBrowse } from "./views/browseView.js";
import { showCart } from "./views/cartView.js";
import { loadProducts } from "./data.js";
import { showProduct } from "./views/productView.js";

//Global Product Array
let products = [];

//adding a function which takes in view id and shows it in the screen -June
export function showView(viewId) {
    document.querySelectorAll("main article").forEach(a => a.style.display = "none");
    document.getElementById(viewId).style.display = "block";
}

//now we will wait for the page to load using the DOMContent loader then start modifyng our HTML -June

document.addEventListener("DOMContentLoaded", async () => {
    //starting to extract data only once also using await so the product gets loaded first.
    products = await loadProducts();
    //only use this line if we need to check the array --June
    console.log(products)
    showView("home");
    showHome(products);
    //by default we will show the user our home

    
    

    //adding hanldes event for the button navigation
    document.getElementById("navHome").addEventListener("click", () => {
        showView("home");
        showHome();
    });

    document.getElementById("navBrowse").addEventListener("click", () => {
        showView("browse");
        showBrowse(products);
    });

    document.getElementById("navCart").addEventListener("click", () => {
        showView("cart");
        showCart();
    });

    document.getElementById("navAbout").addEventListener("click", () => {
        document.getElementById("about").showModal();
    });
})



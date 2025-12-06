import { addToCart } from "./cartView.js";
import { showView } from "../app.js";
import { loadProducts, getRelated } from "../data.js";

export function showProduct(product) {

    const container = document.getElementById("singleproduct");

    container.innerHTML = `
        <section class="product-container">

            <!-- LEFT SIDE (FIXED IMAGE AREA) -->
            <div class="product-left">
                <img id="mainImg" class="product-main-img" 
                     src="images/${product.category}.png" 
                     alt="${product.name}">

                <div id="thumbGrid" class="thumb-grid"></div>
            </div>

            <!-- RIGHT SIDE (DETAILS AREA) -->
            <div class="product-right">

                <!-- Breadcrumb -->
                <nav class="breadcrumb">
                    Home >
                    ${product.gender === "womens" ? "Women" : "Men"} >
                    ${product.category} >
                    <span>${product.name}</span>
                </nav>

                <h1 class="product-title">${product.name}</h1>
                <p class="product-price">$${product.price}</p>

                <p class="product-description">${product.description}</p>

                <p class="product-material">
                    <strong>Material:</strong> ${product.material}
                </p>

                <!-- SIZE SELECTOR -->
                <div class="product-section">
                    <h3>Available Sizes</h3>
                    <div id="sizeBox" class="size-options"></div>
                </div>

                <!-- COLOR SELECTOR -->
                <div class="product-section">
                    <h3>Colors</h3>
                    <div id="colorBox" class="color-options"></div>
                </div>

                <!-- QUANTITY -->
                <div class="product-section">
                    <h3>Quantity</h3>
                    <input id="qtyInput" 
                           type="number" 
                           min="1" 
                           value="1" 
                           class="qty-input">
                </div>

                <button id="btnAddToCart" class="btn add-cart">Add to Cart</button>

                <h2 class="related-title">Related Products</h2>
                <div id="relatedGrid" class="related-grid"></div>

            </div>
        </section>
    `;

    /* ---------------------------
       THUMBNAILS
    ----------------------------*/
    const thumbGrid = document.getElementById("thumbGrid");

    for (let i = 0; i < 3; i++) {
        const thumb = document.createElement("img");
        thumb.src = `images/${product.category}.png`;
        thumb.className = "thumb";

        thumb.addEventListener("click", () => {
            document.getElementById("mainImg").src = thumb.src;
        });

        thumbGrid.appendChild(thumb);
    }

    /* ---------------------------
       SIZE SELECTOR (CLICKABLE)
    ----------------------------*/
    const sizeBox = document.getElementById("sizeBox");
    let selectedSize = null;

    product.sizes.forEach(size => {
        const tag = document.createElement("span");
        tag.textContent = size;
        tag.className = "size-tag";

        tag.addEventListener("click", () => {
            selectedSize = size;
            highlightSelection(sizeBox, "size-tag", tag);
        });

        sizeBox.appendChild(tag);
    });

    /* ---------------------------
       COLOR SELECTOR (CLICKABLE)
    ----------------------------*/
    const colorBox = document.getElementById("colorBox");
    let selectedColor = null;

    product.color.forEach(c => {
        const circle = document.createElement("div");
        circle.className = "color-circle";
        circle.style.backgroundColor = c.name.toLowerCase();

        circle.addEventListener("click", () => {
            selectedColor = c.name;
            highlightSelection(colorBox, "color-circle", circle);
        });

        colorBox.appendChild(circle);
    });

    /* ---------------------------
       ADD TO CART
    ----------------------------*/
    document.getElementById("btnAddToCart").addEventListener("click", () => {

        const qty = parseInt(document.getElementById("qtyInput").value);

        if (!selectedSize || !selectedColor) {
            alert("Please select a size and color before adding to cart.");
            return;
        }

        addToCart(product, qty);
        showView("cart");
    });

    /* ---------------------------
       RELATED PRODUCTS
    ----------------------------*/
    loadProducts().then(products => {
        const related = getRelated(products, product, 4);
        const grid = document.getElementById("relatedGrid");

        related.forEach(r => {
            const card = document.createElement("div");
            card.className = "related-card";

            card.innerHTML = `
                <div class="related-img"></div>
                <h4>${r.name}</h4>
                <p>$${r.price}</p>
            `;

            card.addEventListener("click", () => {
                showProduct(r);
            });

            grid.appendChild(card);
        });
    });
}

/* ---------------------------
   HELPER: Highlight selected
----------------------------*/
function highlightSelection(container, className, selectedElement) {
    [...container.children].forEach(el => el.classList.remove("selected"));
    selectedElement.classList.add("selected");
}

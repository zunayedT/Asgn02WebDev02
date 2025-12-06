import { addToCart } from "./cartView.js";
import { showView } from "../app.js";
import { showCart } from "./cartView.js";
import { getRelated } from "../data.js";
import { loadProducts } from "../data.js";


//Placing all functions at the top for cleaner organization

//Creating a dynamic img list function -- NEED TO READRESS imgSrc USAGE
function generateProdImages(product) {

    // **** BASIC DEFAULT IMG PLACEHOLDER FOR NOW******
    const imgSrc = "images/" + product.category + ".png";

    const mainImg = document.querySelector('#prodMainImg');
    const thumbNail = document.querySelector('#prodThumbs');

    mainImg.src = imgSrc;
    mainImg.alt = product.name;

    thumbNail.innerHTML = "";

    //** BASIC FOR LOOP FOR NOW, SINCE imgSrc IS JUST A PLACEHOLDER**
    for (let i = 0; i < 2; i++) {
        const thumb = document.createElement("img");
        thumb.src = imgSrc;
        thumb.alt = product.name;
        thumb.className = "w-20 h-20 object-cover rounded border cursor-pointer";

        thumb.addEventListener("click", () => {
            mainImg.src = imgSrc;
            mainImg.alt = product.name;
        });
        thumbNail.appendChild(thumb);
    }
}

//Bulidng displays for the related products section -- **AGAIN NEED TO READRESS imgSrc**
function createRelatedProducts(product) {
    const relatedGrid = document.querySelector('#relatedGrid');

    loadProducts()
        .then((products) => {
            //using getRelated function from data.js
            const rel = getRelated(products, product, 4);

            relatedGrid.innerHTML = "";

            for (let r of rel) {
                const display = document = document.createElement("article");
                display.className = "related-card border rounded-lg p-3 hover:shadow cursor-pointer flex flex-col";

                const img = document.createElement("img");
                img.src = imgSrc;
                img.alt = r.name;
                img.className = "w-full h-32 object-cover rounded mb-2";
                display.appendChild(img);

                const name = document.createElement("h3");
                name.textContent = r.name;
                name.className = "text-sm font-semibold";
                display.appendChild(name);

                const price = document.createElement("p");
                price.textContent = "$" + r.price;
                price.className = "text-sm text-blue-600"
                display.appendChild(price);

                relatedGrid.appendChild(display);
            }
        })
}

//kept same formatting as homeView.js
export function showProduct(product) {
    document.getElementById("singleproduct").innerHTML = `
        <section class="max-w-5xl mx-auto py-8 px-4">
        <!-- Breadcrumb -->
        <nav class="text-sm text-gray-500 mb-4">
            <span id="breadcrumbText"></span>
        </nav>

        <!-- Product main content -->
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Left: image placeholders -->
            <div class="flex-1">
                <!-- Main Product image placeholder -->
                <div class="w-full h-72 md:h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span class="text-gray-400 text-sm">Main Product image placeholder</span>
                </div>

                <!-- Smaller product images placeholders -->
                <div class="mt-4 grid grid-cols-2 gap-4">
                    <div class="h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span class="text-gray-300 text-xs">Smaller image</span>
                    </div>
                    <div class="h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span class="text-gray-300 text-xs">Smaller image</span>
                    </div>
                </div>
            </div>

            <!-- Right: product details -->
            <div class="flex-1 space-y-4">
                <h1 class="text-3xl font-bold" id="productTitle"></h1>
                <p class="text-2xl font-semibold text-blue-600" id="productPrice"></p>

                <p class="text-gray-700" id="productDescription"></p>

                <p class="text-sm text-gray-600" id="productMaterial">
                    <span class="font-semibold">Material:</span>
                    <span id="productMaterialText"></span>
                </p>

                <!-- Sizes -->
                <div>
                    <h2 class="text-sm font-semibold mb-2">Available Sizes</h2>
                    <div id="productSizes" class="flex flex-wrap gap-2"></div>
                </div>

                <!-- Colors -->
                <div>
                    <h2 class="text-sm font-semibold mb-2">Colors</h2>
                    <div id="productColors" class="flex flex-wrap gap-3"></div>
                </div>

                <!-- Quantity + Add to Cart -->
                <div class="flex items-center gap-4 mt-4">
                    <div>
                        <label for="qtyInput" class="block text-sm font-semibold mb-1">Quantity</label>
                        <input id="qtyInput" type="number" min="1" value="1"
                            class="w-20 border rounded px-2 py-1">
                    </div>
                    <button id="btnAddToCart"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>

        <!-- Related products -->
        <section class="mt-10">
            <!-- Heading text updated to match mockup -->
            <h2 class="text-xl font-semibold mb-4">Related Products</h2>
            <div id="relatedGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"></div>
        </section>
    </section>
    `;

        // Breadcrumb nav and text
    let genderLbl = "All";
    if (product.gender === "womens") {
        genderLbl = "Women";
    } else if (product.gender === "mens") {
        genderLbl = "Men";
    }

    //Since nav doesn't need to work --> easy solution but can change if we have more time
    const breadcrumb = "Home > " + genderLbl + " > " + product.category + " > " + product.name;

    //Breadcrumb text field
    const breadcrumbSpan = document.querySelector('#breadcrumbText')
    breadcrumbSpan.textContent = breadcrumb;

    //Other text fields on side view
    const prodName = document.querySelector("#productTitle");
    prodName.textContent = product.name;

    const prodPrice = document.querySelector("#productPrice");
    prodPrice.textContent = "$" + product.price;

    const prodDesc = document.querySelector("#productDescription");
    prodDesc.textContent = product.description;

    const prodMaterial = document.querySelector("#productMaterialText");
    prodMaterial.textContent = product.material;

    //Now looping through product sizes
    const sizeBox = document.querySelector('#productSizes');
    //removes all existing options from list
    sizeBox.replaceChildren();

    for (let s of product.sizes) {
        const tag = document.createElement("span");
        tag.textContent = s;
        //setting tag attribute to align with html format above
        tag.setAttribute("class", "px-3 py-1 border rounded-full text-sm hover:bg-gray-100");
        sizeBox.appendChild(tag);
    }

    const btnAddToCart = document.getElementById("btnAddToCart");
    if (btnAddToCart) {
        btnAddToCart.addEventListener("click", () => {
            const qty = parseInt(document.getElementById("qtyInput").value);
            addToCart(product, qty);
            showView("cart");
            showCart();
        });
    }

}

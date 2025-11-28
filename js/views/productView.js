import { showProduct } from "../app.js";

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
}

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
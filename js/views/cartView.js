// --------------------------
// LOCAL STORAGE CART HELPERS
// --------------------------

function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add product (Option A: only qty + product info)
export function addToCart(product, qty) {
    console.log("addToCart called with:", product, qty);
    let cart = getCart();

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: qty
        });
    }

    saveCart(cart);
    console.log("Cart saved:", cart);
}

// Remove item
function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    showCart();
}

// Update quantity
function updateQty(id, qty) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);

    if (item) {
        item.qty = qty;
        if (item.qty <= 0) {
            removeFromCart(id);
            return;
        }
    }

    saveCart(cart);
    showCart();
}

// --------------------------
// MAIN CART VIEW RENDERER
// --------------------------

export function showCart() {
    console.log("showCart called");
    const cart = getCart();
    console.log("Current cart:", cart);
    const container = document.getElementById("cart");

    if (!container) {
        console.error("Cart container not found!");
        return;
    }

    // Compute totals
    let subtotal = 0;
    cart.forEach(item => subtotal += item.price * item.qty);

    let tax = subtotal * 0.05;         // 5% GST (example)
    let shipping = subtotal > 200 ? 0 : 15;  // Free shipping over $200
    let total = subtotal + tax + shipping;

    container.innerHTML = `
        <section class="max-w-4xl mx-auto py-10 px-4">

            <h1 class="text-3xl font-bold mb-6">Shopping Cart</h1>

            ${cart.length === 0 ? `
                <p>Your cart is empty.</p>
            ` : `
                <table class="w-full text-left border-collapse">
                    <thead class="border-b">
                        <tr>
                            <th class="py-2">Product</th>
                            <th class="py-2">Price</th>
                            <th class="py-2">Quantity</th>
                            <th class="py-2">Total</th>
                            <th class="py-2">Remove</th>
                        </tr>
                    </thead>
                    <tbody id="cartRows"></tbody>
                </table>

                <div class="mt-10 p-4 bg-gray-100 rounded-lg max-w-md ml-auto">
                    <p class="flex justify-between">
                        <span>Subtotal:</span> 
                        <span>$${subtotal.toFixed(2)}</span>
                    </p>
                    <p class="flex justify-between">
                        <span>Tax (5%):</span> 
                        <span>$${tax.toFixed(2)}</span>
                    </p>
                    <p class="flex justify-between">
                        <span>Shipping:</span> 
                        <span>$${shipping.toFixed(2)}</span>
                    </p>

                    <hr class="my-2">

                    <p class="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>$${total.toFixed(2)}</span>
                    </p>
                </div>
            `}
        </section>
    `;

    // If cart is empty, don't render rows
    if (cart.length === 0) return;

    const cartRows = document.getElementById("cartRows");

    cart.forEach(item => {
        const row = document.createElement("tr");
        row.className = "border-b";

        row.innerHTML = `
            <td class="py-3">${item.name}</td>
            <td class="py-3">$${item.price.toFixed(2)}</td>
            <td class="py-3">
                <input type="number" 
                       min="1" 
                       value="${item.qty}" 
                       id="qty-${item.id}"
                       class="border rounded w-16 px-2 py-1">
            </td>
            <td class="py-3">$${(item.price * item.qty).toFixed(2)}</td>
            <td class="py-3">
                <button id="rm-${item.id}" class="text-red-600">X</button>
            </td>
        `;

        cartRows.appendChild(row);

        // Add listeners
        document.getElementById(`rm-${item.id}`).addEventListener("click", () => {
            removeFromCart(item.id);
        });

        document.getElementById(`qty-${item.id}`).addEventListener("change", e => {
            const newQty = parseInt(e.target.value);
            updateQty(item.id, newQty);
        });
    });
}
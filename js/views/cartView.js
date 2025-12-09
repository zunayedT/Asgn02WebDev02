//this file will contain all the cart funtionality. Please maintain the intrigity -June.
import { updateCartCount } from "../app.js";
function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(product, qty) {
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
    //Simple fix -- Just swapped these two functions, that's why it wasn't updating number on first click
    // I was looking on this bugs for ages man. Thank you! -June
    saveCart(cart);
    updateCartCount();  
}

// SHIPPING RULES
const SHIPPING_RATES = {
    canada: {
        standard: 10,
        express: 25,
        priority: 35
    },
    usa: {
        standard: 15,
        express: 25,
        priority: 50
    },
    international: {
        standard: 20,
        express: 30,
        priority: 50
    }
};


// Main cart view starts here
export function showCart() {
    const cart = getCart();
    const container = document.getElementById("cart");

    // Compute subtotal
    let subtotal = 0;
    cart.forEach(item => subtotal += item.price * item.qty);

    // Default selection
    let country = "canada";
    let shippingMethod = "standard";

    // Calculate shipping
    function calculateShipping() {
        if (subtotal > 500) {
            return 0; // free shipping rule
        }
        return SHIPPING_RATES[country][shippingMethod];
    }

    function calculateTotals() {
        const shipping = calculateShipping();
        const tax = subtotal * 0.05;
        const total = subtotal + tax + shipping;

        document.getElementById("subtotalVal").textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById("taxVal").textContent = `$${tax.toFixed(2)}`;
        document.getElementById("shippingVal").textContent = `$${shipping.toFixed(2)}`;
        document.getElementById("totalVal").textContent = `$${total.toFixed(2)}`;
    }

container.innerHTML = `
<section class="cart-page">

    <h1 class="page-title">Shopping Cart</h1>

    ${cart.length === 0 ? `
        <p>Your cart is empty.</p>
    ` : `
        <div class="cart-layout">

            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="cartRows"></tbody>
            </table>

            <div class="shipping-box">
                <h2>Shipping Details</h2>

                <label>Ship To:</label>
                <select id="countrySelect">
                    <option value="canada">Canada</option>
                    <option value="usa">USA</option>
                    <option value="international">International</option>
                </select>

                <label>Shipping Method:</label>
                <select id="methodSelect">
                    <option value="standard">Standard</option>
                    <option value="express">Express</option>
                    <option value="priority">Priority</option>
                </select>

                <div class="summary-box">
                    <p><span>Subtotal:</span> <span id="subtotalVal">$0.00</span></p>
                    <p><span>Tax (5%):</span> <span id="taxVal">$0.00</span></p>
                    <p><span>Shipping:</span> <span id="shippingVal">$0.00</span></p>
                    <hr>
                    <p class="total-line"><span>Total:</span> <span id="totalVal">$0.00</span></p>
                </div>
            </div>

        </div>
    `}
</section>
`;
    // If cart empty, stop processing
    if (cart.length === 0) return;

    // Fill cart rows
    const cartRows = document.getElementById("cartRows");

    cart.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>

            <td>
                <input type="number" 
                       class="qty-input"
                       min="1"
                       value="${item.qty}"
                       id="qty-${item.id}">
            </td>

            <td>$${(item.price * item.qty).toFixed(2)}</td>

            <td>
                <button class="remove-btn" id="rm-${item.id}">X</button>
            </td>
        `;

        cartRows.appendChild(row);

        // Remove button
        document.getElementById(`rm-${item.id}`).addEventListener("click", () => {
            removeItem(item.id);
        });

        // Update quantity
        document.getElementById(`qty-${item.id}`).addEventListener("change", e => {
            const newQty = parseInt(e.target.value);
            updateQty(item.id, newQty);
        });
    });

    // Event listeners for shipping options
    document.getElementById("countrySelect").addEventListener("change", e => {
        country = e.target.value;
        calculateTotals();
    });

    document.getElementById("methodSelect").addEventListener("change", e => {
        shippingMethod = e.target.value;
        calculateTotals();
    });
    calculateTotals();
}

//remove and update functions -June
function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    showCart();
    updateCartCount();  

}

function updateQty(id, qty) {
    if (qty < 1) qty = 1;

    let cart = getCart();
    const item = cart.find(i => i.id === id);

    if (item) {
        item.qty = qty;
    }
    saveCart(cart);
    showCart();
    updateCartCount();  

}

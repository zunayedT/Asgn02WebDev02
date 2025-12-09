// data.js — Handles product fetching + caching

const DATA_URL = "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";
const STORAGE_KEY = "products-data";

export async function loadProducts() {
    // 1. Check localStorage first
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            return parsed;
        } catch (err) {
            console.error("LocalStorage corrupted, clearing...", err);
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    // 2. If no valid cache → fetch from API
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error("Failed to fetch product data");

        const data = await response.json();

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

        return data;
    } catch (err) {
        console.error("Error fetching product data:", err);
        return []; // return empty so app doesn't crash
    }
}

//Citation for Export: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
//As we are trying to keep a clean code we need to pass our functions here and there inside js module. - June
// get product by id
export function getProductById(products, id) {
    return products.find(p => p.id == id);
}

// get related products (same category)
export function getRelated(products, product, count = 4) {
    return products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, count);
}

// clear product cache (for debugging)
export function clearProductCache() {
    localStorage.removeItem(STORAGE_KEY);
}

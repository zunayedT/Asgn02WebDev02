
export async function loadProducts() {

    console.log("Fetching products from API...");

    const url = "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";

    // Fetch from API
    const response = await fetch(url);
    const data = await response.json();

    // Store in localStorage
    let saved = localStorage.setItem("products", JSON.stringify(data));

    return data;
}

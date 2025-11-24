export function showBrowse(products) {
    document.getElementById("browse").innerHTML = `
        <h1>Browse View</h1>
        <p>Loaded ${products.length} products.</p>
    `;
}

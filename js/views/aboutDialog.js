export function setupAboutDialog() {
    const dialog = document.getElementById("about");
    const closeBtn = document.getElementById("aboutCloseBtn");

    closeBtn.addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", (e) => {
        const content = dialog.querySelector(".about-content");
        if (!content.contains(e.target)) dialog.close();
    });
}

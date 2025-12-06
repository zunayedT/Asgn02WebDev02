// aboutDialog.js

export function setupAboutDialog() {
    const dialog = document.getElementById("about");
    const btnClose = document.getElementById("btnCloseAbout");

    // Close button inside dialog
    btnClose.addEventListener("click", () => dialog.close());

    // Clicking background closes dialog
    dialog.addEventListener("click", (e) => {
        const rect = dialog.getBoundingClientRect();
        const inside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

        if (!inside) dialog.close();
    });
}
// i dont care this

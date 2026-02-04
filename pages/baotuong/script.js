document.addEventListener("DOMContentLoaded", () => {
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            document.body.classList.add("fonts-loaded");
        });
    } else {
        document.body.classList.add("fonts-loaded");
    }
});

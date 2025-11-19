function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    window.location.href = "categories.html";
}

function getLangText(en, ru) {
    return localStorage.getItem("lang") === "ru" ? ru : en;
}

// меняем заголовки
window.addEventListener("DOMContentLoaded", () => {
    const title = document.getElementById("title");

    if (title) {
        const titleText = document.querySelector(".title-text");
        if (titleText) {
            titleText.textContent = getLangText("Menu", "Меню");
        }
    }
});

function toggleLanguage() {
    let current = localStorage.getItem("lang") || "ru";
    let next = current === "ru" ? "en" : "ru";
    localStorage.setItem("lang", next);

    location.reload(); // перезагружаем страницу, чтобы обновить текст
}

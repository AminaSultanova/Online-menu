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
        title.textContent = getLangText("Menu", "Меню");
    }
});

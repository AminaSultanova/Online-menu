function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    window.location.href = "categories.html";
}

function getLangText(en, ru) {
    return localStorage.getItem("lang") === "ru" ? ru : en;
}

window.addEventListener("DOMContentLoaded", () => {
    const titleText = document.querySelector(".title-text");
    if (titleText) {
        titleText.textContent = getLangText("Menu", "Меню");
    }

    const backBtn = document.querySelector(".back-btn");
    if (backBtn) {
        backBtn.textContent = getLangText("← Back", "← Назад");
    }
});


function toggleLanguage() {
    let current = localStorage.getItem("lang") || "ru";
    let next = current === "ru" ? "en" : "ru";
    localStorage.setItem("lang", next);

    location.reload(); // перезагружаем страницу, чтобы обновить текст
}

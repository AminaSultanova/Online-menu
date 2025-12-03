function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    window.location.href = "categories.html";
}

function getLangText(en, ru) {
    return localStorage.getItem("lang") === "ru" ? ru : en;
}

function updateAllTexts() {
    const lang = localStorage.getItem("lang") || "ru";
    
    const elements = document.querySelectorAll('[data-lang-ru]');
    elements.forEach(el => {
        const text = lang === "ru" 
            ? el.getAttribute('data-lang-ru')
            : el.getAttribute('data-lang-en');
        
        if (text) {
            el.textContent = text;
        }
    });
    
    const titleText = document.querySelector(".title-text");
    if (titleText) {
        titleText.textContent = getLangText("Menu", "Меню");
    }

    const backBtn = document.querySelector(".back-btn");
    if (backBtn) {
        backBtn.textContent = getLangText("← Back", "← Назад");
    }
    
    const bonusText = document.querySelector('.bonus-text');
    if (bonusText) {
        bonusText.textContent = lang === "ru" 
            ? bonusText.getAttribute('data-lang-ru')
            : bonusText.getAttribute('data-lang-en');
    }
}

window.addEventListener("DOMContentLoaded", () => {
    updateAllTexts();
});

function toggleLanguage() {
    let current = localStorage.getItem("lang") || "ru";
    let next = current === "ru" ? "en" : "ru";
    localStorage.setItem("lang", next);

    updateAllTexts();
    
    if (typeof loadCategories === 'function' && location.pathname.includes("categories.html")) {
        loadCategories();
    }
    if (typeof loadItems === 'function' && location.pathname.includes("items.html")) {
        loadItems();
    }
}
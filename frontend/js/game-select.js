function getBonuses() {
    const dessertBonuses = parseInt(localStorage.getItem('dessertBonuses')) || 0;
    const coffeeBonuses = parseInt(localStorage.getItem('coffeeBonuses')) || 0;
    
    return {
        dessert: dessertBonuses,
        coffee: coffeeBonuses,
        total: dessertBonuses + coffeeBonuses
    };
}

function updateBonusDisplay() {
    const bonuses = getBonuses();
    
    document.getElementById('dessertBonuses').textContent = bonuses.dessert;
    document.getElementById('coffeeBonuses').textContent = bonuses.coffee;
    document.getElementById('totalBonuses').textContent = bonuses.total;
}

function selectGame(gameType) {
    if (gameType === 'tower') {
        window.location.href = 'game.html';
    } else if (gameType === 'catcher') {
        window.location.href = 'coffee-catcher.html';
    }
}
function goBackToMenu() {
    window.location.href = 'categories.html';
}

function updateGameSelectLanguage() {
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
}

window.addEventListener('DOMContentLoaded', () => {
    updateGameSelectLanguage();
    updateBonusDisplay();
});
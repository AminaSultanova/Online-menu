const API = "http://localhost:3000/api";

async function loadCategories() {
    const res = await fetch(`${API}/categories`);
    const categories = await res.json();

    const lang = localStorage.getItem("lang") || "ru";

    document.getElementById("categoryList").innerHTML = categories
        .map(cat => `
        <div class="card" onclick="openCategory(${cat.id}, event)">
            <img src="${cat.image_url}">
            <h3>${lang === "ru" ? cat.name_ru : cat.name_en}</h3>
        </div>
        `)
        .join("");
}

async function loadItems() {
    const id = new URLSearchParams(location.search).get("cat");

    const res = await fetch(`${API}/items/category/${id}`);
    const items = await res.json();

    const lang = localStorage.getItem("lang") || "ru";

    document.getElementById("itemList").innerHTML = items
        .map(item => `
        <div class="card">
            <img src="${item.image_url}">
            <h3>${lang === "ru" ? item.name_ru : item.name_en}</h3>
            <p>${lang === "ru" ? item.description_ru : item.description_en}</p>
            <p><b>${item.price} KGS</b></p>
        </div>
        `)
        .join("");
}

function openCategory(id, event) {
    const card = event.currentTarget;
    
    card.style.transform = 'scale(0.95)';
    card.style.opacity = '0.7';
    
    localStorage.setItem('selectedCategory', id);
    
    setTimeout(() => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            window.location.href = `items.html?cat=${id}`;
        }, 300);
    }, 200);
}

function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = "categories.html";
    }, 300);
}

window.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.4s ease';
    }, 50);
});

if (location.pathname.includes("categories.html")) loadCategories();
if (location.pathname.includes("items.html")) loadItems();
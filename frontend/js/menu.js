const API = "http://localhost:3000/api";

async function loadCategories() {
    const res = await fetch(`${API}/categories`);
    const categories = await res.json();

    const lang = localStorage.getItem("lang") || "ru";

    document.getElementById("categoryList").innerHTML = categories
        .map(cat => `
        <div class="card" onclick="openCategory(${cat.id})">
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

function openCategory(id) {
    window.location.href = `items.html?cat=${id}`;
}

function goBack() {
    window.location.href = "categories.html";
}

if (location.pathname.includes("categories.html")) loadCategories();
if (location.pathname.includes("items.html")) loadItems();

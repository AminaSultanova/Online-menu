const API = "http://localhost:3000/api";

function showTab(tab) {
    document.getElementById("categoriesTab").style.display = "none";
    document.getElementById("itemsTab").style.display = "none";

    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    event.target.classList.add("active");

    document.getElementById(tab).style.display = "block";
}

// CATEGORIES

async function loadCategoriesAdmin() {
    const res = await fetch(`${API}/categories`);
    const categories = await res.json();

    // Fill list
    document.getElementById("categoriesList").innerHTML = categories
        .map(c => `
            <div class="admin-item">
                <div>
                    <b>${c.name_ru}</b> / ${c.name_en}<br>
                    <small>${c.image_url}</small>
                </div>
                <button class="delete-btn" onclick="deleteCategory(${c.id})">Delete</button>
            </div>
        `)
        .join("");

    // Fill category dropdown
    document.getElementById("item_category").innerHTML = categories
        .map(c => `<option value="${c.id}">${c.name_ru}</option>`)
        .join("");
}

async function addCategory() {
    const data = {
        name_ru: document.getElementById("cat_name_ru").value,
        name_en: document.getElementById("cat_name_en").value,
        image_url: document.getElementById("cat_image").value
    };

    await fetch(`${API}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    loadCategoriesAdmin();
}

async function deleteCategory(id) {
    await fetch(`${API}/categories/${id}`, { method: "DELETE" });
    loadCategoriesAdmin();
}

// ITEMS

async function loadItemsAdmin() {
    const res = await fetch(`${API}/items`);
    const items = await res.json();

    document.getElementById("itemsList").innerHTML = items
        .map(i => `
            <div class="admin-item">
                <div>
                    <b>${i.name_ru}</b> / ${i.name_en}<br>
                    Price: ${i.price}<br>
                    <small>${i.image_url}</small>
                </div>
                <button class="delete-btn" onclick="deleteItem(${i.id})">Delete</button>
            </div>
        `)
        .join("");
}

async function addItem() {
    const data = {
        category_id: document.getElementById("item_category").value,
        name_ru: document.getElementById("item_name_ru").value,
        name_en: document.getElementById("item_name_en").value,
        description_ru: document.getElementById("item_desc_ru").value,
        description_en: document.getElementById("item_desc_en").value,
        price: document.getElementById("item_price").value,
        image_url: document.getElementById("item_image").value
    };

    await fetch(`${API}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    loadItemsAdmin();
}

async function deleteItem(id) {
    await fetch(`${API}/items/${id}`, { method: "DELETE" });
    loadItemsAdmin();
}

loadCategoriesAdmin();
loadItemsAdmin();

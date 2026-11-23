console.log("home.js loaded");
const search = document.querySelector(".search-input");
const cards = document.querySelectorAll(".card");
const categorySelect = document.querySelector(".category-select");
const noResults = document.querySelector(".no-results");
function filterCards() {
    const searchText = search.value.toLowerCase();
    const category = categorySelect.value;
    let visible = 0;
    cards.forEach(function (card) {
        const title = card.querySelector(".card-title").textContent.toLowerCase();
        const author = card.querySelector(".card-author").textContent.toLowerCase();
        const cardCategory = card.querySelector(".card-category").textContent.toLowerCase();
        if ((title.includes(searchText) || author.includes(searchText)) && (category === "all" || category === cardCategory)) {
            card.style.display = "flex";
            visible++;
        }
        else {
            card.style.display = "none";
        }
    });
    noResults.hidden = visible > 0;
}
search.addEventListener("input", filterCards);
categorySelect.addEventListener("change", filterCards);
function updateStats() {
    const total = document.querySelectorAll(".card").length;
    const available = document.querySelectorAll(".status-available").length;
    const issued = document.querySelectorAll(".status-issued").length;
    document.querySelector("#total-count").textContent = total;
    document.querySelector("#available-count").textContent = available;
    document.querySelector("#issued-count").textContent = issued;
}
updateStats();
const statuses = document.querySelectorAll(".card-status");

statuses.forEach(function (status) {
    status.addEventListener("click", function () {
        if (!document.body.classList.contains("is-librarian")) {
            return;
        }
        if (status.classList.contains("status-available")) {
            status.classList.remove("status-available");
            status.classList.add("status-issued");
            status.textContent = "Issued";
        } else if (status.classList.contains("status-issued")) {
            status.classList.remove("status-issued");
            status.classList.add("status-available");
            status.textContent = "Available";
        }
        updateStats();
    });
});
const avatar = document.querySelector("#avatar");
const profileMenu = document.querySelector("#profile-menu");
async function loadUser() {
    const response = await fetch("/api/session");
    if (!response.ok) {
        document.querySelector("#profile-email").textContent = "Not logged in";
        return;
    }
    const data = await response.json();
    if (data.user.role === "Librarian") {
        document.body.classList.add("is-librarian");
    }
    document.querySelector("#profile-email").textContent = data.user.email;
    document.querySelector("#profile-role").textContent = "Role: " + data.user.role;
}
loadUser();
avatar.addEventListener("click", function () {
    profileMenu.hidden = !profileMenu.hidden;
});
const modal = document.querySelector("#book-modal");
cards.forEach(function (card) {
    card.addEventListener("click", function (event) {
        if (event.target.closest(".card-status")) {
            return;
        }
        document.querySelector("#modal-category").textContent = card.querySelector(".card-category").textContent;
        document.querySelector("#modal-title").textContent = card.querySelector(".card-title").textContent;
        document.querySelector("#modal-author").textContent = card.querySelector(".card-author").textContent;
        document.querySelector("#modal-status").textContent = "Status: " + card.querySelector(".card-status").textContent;
        document.querySelector("#modal-description").textContent = card.dataset.description || "No description available.";
        modal.hidden = false;
    });
});
document.querySelector("#modal-close").addEventListener("click", function () {
    modal.hidden = true;
});
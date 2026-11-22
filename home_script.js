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
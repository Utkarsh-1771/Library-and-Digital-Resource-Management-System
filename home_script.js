const search = document.querySelector(".search-input");
const cards = document.querySelectorAll(".card");
const categorySelect = document.querySelector(".category-select");
search.addEventListener("input", function () {
    const searchText = search.value.toLowerCase();
    cards.forEach(function (card) {
        const title = card.querySelector(".card-title").textContent.toLowerCase();
        const author = card.querySelector(".card-author").textContent.toLowerCase();
        if (title.includes(searchText) || author.includes(searchText)) {
            card.style.display = "flex";
        }
        else {
            card.style.display = "none";
        }
    });
});
function filterCards() {
    const searchText = search.value.toLowerCase();
    const category = categorySelect.value;
    cards.forEach(function (card) {
        const title = card.querySelector(".card-title").textContent.toLowerCase();
        const author = card.querySelector(".card-author").textContent.toLowerCase();
        const cardCategory = card.querySelector(".card-category").textContent.toLowerCase();
        if ((title.includes(searchText) || author.includes(searchText)) && (category === "all" || category === cardCategory)) {
            card.style.display = "flex";
        }
        else {
            card.style.
                display = "none";
        }
    });
}
search.addEventListener("input", filterCards);
categorySelect.addEventListener("change", filterCards);


const addButton = document.querySelector("#add-book-btn");
const addMessage = document.querySelector("#add-message");


function showMessage(element, text, type) {
    element.textContent = text;
    element.classList.remove("msg-error", "msg-success");
    element.classList.add(type);
}

addButton.addEventListener("click", function () {
    
    const title = document.querySelector("#book-name").value.trim();
    const author = document.querySelector("#book-author").value.trim();
    const category = document.querySelector("#book-category").value;
    const quantity = Number(document.querySelector("#book-quantity").value);
    const description = document.querySelector("#book-description").value.trim();

    
    if (!title || !author || quantity < 1) {
        showMessage(addMessage, "Please fill in the name, author and a quantity of at least 1.", "msg-error");
        return;
    }

    
    const books = JSON.parse(localStorage.getItem("books")) || [];

    
    const alreadyExists = books.some(function (book) {
        return book.title.toLowerCase() === title.toLowerCase();
    });

    if (alreadyExists) {
        showMessage(addMessage, "A book with this name has already been added.", "msg-error");
        return;
    }

    
    books.push({ title, author, category, quantity, description, status: "Available" });
    localStorage.setItem("books", JSON.stringify(books));

    showMessage(addMessage, "Book added. You can now see it on the home page.", "msg-success");

    
    document.querySelector("#book-name").value = "";
    document.querySelector("#book-author").value = "";
    document.querySelector("#book-category").selectedIndex = 0;
    document.querySelector("#book-quantity").value = "";
    document.querySelector("#book-description").value = "";
});
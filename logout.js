const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const response = await fetch("/api/logout", {
        method: "POST"
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.removeItem("user");
        alert(data.message);
        window.location.href = "index.html";
    }
});
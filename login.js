const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const roleInput = document.getElementById("role");
const message = document.getElementById("message");
const signupLink = document.getElementById("signupLink");

let isSignup = false;

signupLink.addEventListener("click", function (e) {
    e.preventDefault();

    isSignup = !isSignup;

    if (isSignup) {
        document.querySelector("h2").textContent = "Create account";
        document.querySelector(".sub").textContent = "Enter your details to create an account.";
        document.getElementById("loginBtn").textContent = "Create account";
        signupLink.textContent = "Log in";
        document.querySelector(".footer-text").firstChild.textContent = "Already registered? ";
    } else {
        document.querySelector("h2").textContent = "Log in";
        document.querySelector(".sub").textContent = "Enter your details to open the library catalogue.";
        document.getElementById("loginBtn").textContent = "Log in";
        signupLink.textContent = "Create an account";
        document.querySelector(".footer-text").firstChild.textContent = "New here? ";
    }

    message.textContent = "";
});

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const role = roleInput.value;

    const endpoint = isSignup ? "/api/register" : "/api/login";

    message.textContent = "Please wait...";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                role
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            return;
        }

        if (isSignup) {
            message.textContent = "Account created! You can now log in.";

            isSignup = false;
            document.querySelector("h2").textContent = "Log in";
            document.querySelector(".sub").textContent = "Enter your details to open the library catalogue.";
            document.getElementById("loginBtn").textContent = "Log in";
            signupLink.textContent = "Create an account";
            document.querySelector(".footer-text").firstChild.textContent = "New here? ";

            passwordInput.value = "";
        } else {
            message.textContent = "Login successful!";
            window.location.href = "home.html";
        }

    } catch (error) {
        message.textContent = "Unable to connect to server.";
        console.error(error);
    }
});
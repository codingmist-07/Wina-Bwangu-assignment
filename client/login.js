/* =================================================================
login.js-handles the login form
Reads the username and password, validates them on the client side,
sends them to the backend API, and redirects on success.
===================================================================*/

const API_URL = "http://localhost:3000/api/auth/login";

const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");
const messageBox = document.getElementById("message");

function clearState(){
    document.querySelectorAll(".form-group").forEach(function(group){
        group.classList.remove("is-invalid");
    });

    usernameError.textContent = "";
    passwordError.textContent = "";

    messageBox.classList.remove("is-success", "is-error");
    messageBox.textContent = "";
}


function showFieldError(input, errorEI, message){
    input.closest(".form-group").classList.add("is-invalid");
    errorEI.textContent = message;
}


function validateForm() {
    let valid = true;

    if(!usernameInput.value.trim()) {
        showFieldError(usernameInput, usernameError, "Please enter your username.");
        valid = false;
    }

    if(!passwordInput.value.trim()) {
        showFieldError(passwordInput, passwordError, "Please enter your password.");
        valid = false;
    }

    return valid;
}


function showMessage(text, kind) {
    messageBox.textContent = text;
    messageBox.classList.add(kind === "success"? "is-success": "is-error");
}


async function handleSubmit(event) {
    event.preventDefault();
    clearState();

    if(!validateForm()) {
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const button = form.querySelector("button");
    button.disabled = true;
    button.textContent = "Signing in..."

    try{
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: username, password: password})
    });

    const data = await response.json();

    if(data.success) {
        sessionStorage.setItem("winaUser", data.username);
        sessionStorage.setItem("winaRole", data.role);

        showMessage("Login successfull. Redirecting...", "Success");

        setTimeout(function () {
            window.location.href = "index.html";
        }, 1000);
    } else {
        showMessage(data.message || "Login failed.", "error");
        button.disabled = false;
        button.textContent = "Login";
    }
    
    
    } catch (error) {
        console.error("Login error:", error);
        showMessage("Could not reach the server. Please try again.", "error");
        button.disabled = false;
        button.textContent = "Login";
    }
}

form.addEventListener("submit", handleSubmit);
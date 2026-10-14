/* ============================================================================
   register.js — handles the registration form
   ========================================================================== */

const API_URL = "http://localhost:3000/api/auth/register";

const form = document.getElementById("RegisterForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const messageBox = document.getElementById("message");

function clearState() {
    document.querySelectorAll(".form-group").forEach(function (group) {
        group.classList.remove("is-invalid");
    });

    usernameError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    messageBox.classList.remove("is-success", "is-error");
    messageBox.textContent = "";
}

function showFieldError(input, errorEl, message) {
    input.closest(".form-group").classList.add("is-invalid");
    errorEl.textContent = message;
}

function validateForm() {
    let valid = true;

    if (!usernameInput.value.trim()) {
        showFieldError(usernameInput, usernameError, "Please enter your username.");
        valid = false;
    }

    if (!passwordInput.value.trim()) {
        showFieldError(passwordInput, passwordError, "Please enter your password.");
        valid = false;
    } else if (passwordInput.value.trim().length < 8) {
        showFieldError(passwordInput, passwordError, "Password must be at least 8 characters.");
        valid = false;
    }

    if (!confirmPassword.value.trim()) {
        showFieldError(confirmPassword, confirmPasswordError, "Please confirm your password.");
        valid = false;
    } else if (confirmPassword.value.trim() !== passwordInput.value.trim()) {
        showFieldError(confirmPassword, confirmPasswordError, "Passwords do not match.");
        valid = false;
    }

    return valid;
}

function showMessage(text, kind) {
    messageBox.textContent = text;
    messageBox.classList.add(kind === "success" ? "is-success" : "is-error");
}

async function handleSubmit(event) {
    event.preventDefault();
    clearState();

    if (!validateForm()) {
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const button = form.querySelector("button");
    button.disabled = true;
    button.textContent = "Creating account...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password })
        });

        const data = await response.json();

        if (data.success) {
            showMessage("Account created. Redirecting to Dashboard...", "success");
            setTimeout(function () {
                window.location.href = "index.html";
            }, 1500);
        } else {
            showMessage(data.message || "Registration failed.", "error");
            button.disabled = false;
            button.textContent = "Create account";
        }

    } catch (error) {
        console.error("Register error:", error);
        showMessage("Could not reach the server. Please try again.", "error");
        button.disabled = false;
        button.textContent = "Create account";
    }
}

form.addEventListener("submit", handleSubmit);
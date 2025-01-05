document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login-form");
    const errorMessage = document.querySelector("#error-message");

    // Ustaw hasło do logowania
    const adminPassword = "admin";

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const enteredPassword = document.querySelector("#password").value;

        if (enteredPassword === adminPassword) {
            // Przekierowanie do panelu administratora
            window.location.href = "admin.html";
        } else {
            // Wyświetlenie komunikatu o błędzie
            errorMessage.style.display = "block";
        }
    });
});

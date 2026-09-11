const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    loginMessage.className = "";
    loginMessage.style.display = "none";

    try {

        const response = await fetch("/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                password: password
            })

        });

        if (!response.ok) {

            let errorMessage =
                "Invalid username or password.";

            try {
                const errorData = await response.json();

                if (errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (error) {
                // Ignore JSON parsing error
            }

            throw new Error(errorMessage);
        }

        const user = await response.json();

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        loginMessage.textContent =
            "Login successful. Redirecting...";

        loginMessage.className =
            "message-success";

        loginMessage.style.display = "block";


        setTimeout(function () {

            if (user.role === "ADMIN") {

                window.location.href =
                    "/admin-dashboard.html";

            } else {

                window.location.href =
                    "/user-dashboard.html";
            }

        }, 500);

    } catch (error) {

        loginMessage.textContent =
            error.message;

        loginMessage.className =
            "message-error";

        loginMessage.style.display = "block";
    }

});
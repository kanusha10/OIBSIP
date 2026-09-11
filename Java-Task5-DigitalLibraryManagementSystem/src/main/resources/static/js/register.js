const registerForm =
    document.getElementById("registerForm");

const registerMessage =
    document.getElementById("registerMessage");


registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const username =
            document
                .getElementById("registerUsername")
                .value
                .trim();

        const displayName =
            document
                .getElementById("displayName")
                .value
                .trim();

        const password =
            document
                .getElementById("registerPassword")
                .value;


        registerMessage.className = "";

        registerMessage.style.display = "none";


        try {

            const response = await fetch(
                "/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        username: username,

                        displayName: displayName,

                        password: password

                    })
                }
            );


            if (!response.ok) {

                let errorMessage =
                    "Registration failed.";

                try {

                    const errorData =
                        await response.json();

                    if (errorData.message) {
                        errorMessage =
                            errorData.message;
                    }

                } catch (error) {
                    // Ignore JSON parsing error
                }

                throw new Error(errorMessage);
            }


            const data =
                await response.json();


            registerMessage.textContent =
                "Registration successful. You can now login to your account.";

            registerMessage.className =
                "message-success";

            registerMessage.style.display =
                "block";


            registerForm.reset();


            setTimeout(function () {

                window.location.href =
                    "/login.html";

            }, 1800);


        } catch (error) {

            registerMessage.textContent =
                error.message;

            registerMessage.className =
                "message-error";

            registerMessage.style.display =
                "block";
        }

    }
);
const storedUser =
    localStorage.getItem("user");


/* =========================
   AUTHENTICATION
   ========================= */

if (!storedUser) {

    window.location.replace(
        "/login.html"
    );
}

const currentUser =
    JSON.parse(storedUser);


if (currentUser.role !== "USER") {

    window.location.replace(
        "/admin-dashboard.html"
    );
}


/* =========================
   ELEMENTS
   ========================= */

const welcomeName =
    document.getElementById("welcomeName");

const booksContainer =
    document.getElementById("booksContainer");

const issuesContainer =
    document.getElementById("issuesContainer");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const showAllBtn =
    document.getElementById("showAllBtn");

const contactForm =
    document.getElementById("contactForm");

const contactStatus =
    document.getElementById("contactStatus");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================
   WELCOME
   ========================= */

welcomeName.textContent =
    currentUser.displayName;


/* =========================
   LOGOUT
   ========================= */

logoutBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem("user");

        window.location.replace(
            "/login.html"
        );

    }
);


/* =========================
   LOAD ALL BOOKS
   ========================= */

async function loadBooks() {

    booksContainer.innerHTML =
        '<div class="empty-state">Loading books...</div>';

    try {

        const response =
            await fetch("/api/books");

        if (!response.ok) {
            throw new Error(
                "Unable to load books."
            );
        }

        const books =
            await response.json();

        displayBooks(books);

    } catch (error) {

        booksContainer.innerHTML = `
            <div class="empty-state">
                ${error.message}
            </div>
        `;
    }
}


/* =========================
   DISPLAY BOOKS
   ========================= */

function displayBooks(books) {

    booksContainer.innerHTML = "";


    if (!books || books.length === 0) {

        booksContainer.innerHTML = `
            <div class="empty-state">
                No books found in the library.
            </div>
        `;

        return;
    }


    books.forEach(function (book) {

        const card =
            document.createElement("div");

        card.className =
            "book-card";


        const available =
            Number(book.quantity) > 0;


        card.innerHTML = `

            <span class="category-badge">
                ${escapeHtml(book.category)}
            </span>

            <h3>
                ${escapeHtml(book.title)}
            </h3>

            <p>
                <strong>Author:</strong>
                ${escapeHtml(book.author)}
            </p>

            <p class="availability">

                <strong>Availability:</strong>

                <span class="${
                    available
                        ? "available"
                        : "unavailable"
                }">

                    ${
                        available
                            ? book.quantity + " copies available"
                            : "Currently unavailable"
                    }

                </span>

            </p>

            <button
                data-book-id="${book.id}"
                data-action="${
                    available
                        ? "issue"
                        : "reserve"
                }"
            >

                ${
                    available
                        ? "Issue Book"
                        : "Reserve Book"
                }

            </button>

        `;


        const button =
            card.querySelector("button");


        button.addEventListener(
            "click",
            function () {

                const bookId =
                    Number(
                        button.dataset.bookId
                    );

                const action =
                    button.dataset.action;


                if (action === "issue") {

                    issueBook(bookId);

                } else {

                    reserveBook(bookId);

                }

            }
        );


        booksContainer.appendChild(card);

    });
}


/* =========================
   SEARCH BOOKS
   ========================= */

searchBtn.addEventListener(
    "click",
    searchBooks
);


searchInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchBooks();

        }

    }
);


async function searchBooks() {

    const title =
        searchInput.value.trim();


    if (!title) {

        loadBooks();

        return;
    }


    booksContainer.innerHTML =
        '<div class="empty-state">Searching...</div>';


    try {

        const response =
            await fetch(
                "/api/books/search/title?title="
                + encodeURIComponent(title)
            );


        if (!response.ok) {
            throw new Error(
                "Search failed."
            );
        }


        const books =
            await response.json();


        displayBooks(books);

    } catch (error) {

        booksContainer.innerHTML = `
            <div class="empty-state">
                ${error.message}
            </div>
        `;
    }
}


/* =========================
   SHOW ALL
   ========================= */

showAllBtn.addEventListener(
    "click",
    function () {

        searchInput.value = "";

        loadBooks();

    }
);


/* =========================
   ISSUE BOOK
   ========================= */

async function issueBook(bookId) {

    try {

        const response =
            await fetch(
                "/api/issues",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        userId:
                            currentUser.id,

                        bookId:
                            bookId

                    })

                }
            );


        if (!response.ok) {

            let message =
                "Unable to issue book.";

            try {

                const data =
                    await response.json();

                if (data.message) {
                    message =
                        data.message;
                }

            } catch (error) {
                // Ignore
            }

            throw new Error(message);
        }


        alert(
            "Book issued successfully."
        );


        await loadBooks();

        await loadMyBooks();


    } catch (error) {

        alert(error.message);
    }
}


/* =========================
   RESERVE BOOK
   ========================= */

async function reserveBook(bookId) {

    try {

        const response =
            await fetch(
                "/api/reservations",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        userId:
                            currentUser.id,

                        bookId:
                            bookId

                    })

                }
            );


        if (!response.ok) {

            let message =
                "Unable to reserve book.";

            try {

                const data =
                    await response.json();

                if (data.message) {
                    message =
                        data.message;
                }

            } catch (error) {
                // Ignore
            }

            throw new Error(message);
        }


        alert(
            "Book reserved successfully."
        );


    } catch (error) {

        alert(error.message);
    }
}


/* =========================
   LOAD MY BOOKS
   ========================= */

async function loadMyBooks() {

    issuesContainer.innerHTML =
        '<div class="empty-state">Loading your books...</div>';


    try {

        const response =
            await fetch(
                "/api/issues/user/"
                + currentUser.id
            );


        if (!response.ok) {
            throw new Error(
                "Unable to load your books."
            );
        }


        const issues =
            await response.json();


        displayMyBooks(issues);


    } catch (error) {

        issuesContainer.innerHTML = `
            <div class="empty-state">
                ${error.message}
            </div>
        `;
    }
}


/* =========================
   DISPLAY MY BOOKS
   ========================= */

function displayMyBooks(issues) {

    issuesContainer.innerHTML = "";


    if (!issues || issues.length === 0) {

        issuesContainer.innerHTML = `
            <div class="empty-state">
                You have not borrowed any books yet.
            </div>
        `;

        return;
    }


    issues.forEach(function (issue) {

        const card =
            document.createElement("div");

        card.className =
            "issue-card";


        const returned =
            issue.status === "RETURNED";


        const fine =
            Number(issue.fine || 0);


        let fineText;


        if (fine === 0) {

            fineText = "No fine";

        } else if (issue.finePaid) {

            fineText = "₹" + fine + " - Paid";

        } else {

            fineText =
                "₹" + fine + " - Pending";
        }


        card.innerHTML = `

            <h3>
                ${escapeHtml(issue.book.title)}
            </h3>

            <div class="issue-info">

                <div class="issue-info-item">

                    <span>Author</span>

                    <strong>
                        ${escapeHtml(issue.book.author)}
                    </strong>

                </div>

                <div class="issue-info-item">

                    <span>Issue Date</span>

                    <strong>
                        ${formatDate(issue.issueDate)}
                    </strong>

                </div>

                <div class="issue-info-item">

                    <span>Due Date</span>

                    <strong>
                        ${formatDate(issue.dueDate)}
                    </strong>

                </div>

                <div class="issue-info-item">

                    <span>Fine</span>

                    <strong class="${
                        fine > 0
                            ? "issue-fine"
                            : ""
                    }">

                        ${fineText}

                    </strong>

                </div>

            </div>


            <span class="
                issue-status
                ${returned ? "returned" : "active"}
            ">

                ${
                    returned
                        ? "Returned"
                        : "Currently Issued"
                }

            </span>


            ${
                !returned
                    ? `
                        <br>

                        <button
                            data-issue-id="${issue.id}"
                        >
                            Return Book
                        </button>
                    `
                    : ""
            }

        `;


        if (!returned) {

            const returnButton =
                card.querySelector("button");


            returnButton.addEventListener(
                "click",
                function () {

                    returnBook(
                        issue.id
                    );

                }
            );
        }


        issuesContainer.appendChild(card);

    });
}


/* =========================
   RETURN BOOK
   ========================= */

async function returnBook(issueId) {

    const confirmed =
        confirm(
            "Are you sure you want to return this book?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/issues/"
                + issueId
                + "/return",
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            let message =
                "Unable to return book.";

            try {

                const data =
                    await response.json();

                if (data.message) {
                    message =
                        data.message;
                }

            } catch (error) {
                // Ignore
            }

            throw new Error(message);
        }


        alert(
            "Book returned successfully."
        );


        await loadBooks();

        await loadMyBooks();


    } catch (error) {

        alert(error.message);
    }
}


/* =========================
   CONTACT FORM
   ========================= */

contactForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("contactName")
                .value
                .trim();


        const email =
            document
                .getElementById("contactEmail")
                .value
                .trim();


        const message =
            document
                .getElementById("contactMessage")
                .value
                .trim();


        contactStatus.textContent =
            "Sending message...";


        try {

            const response =
                await fetch(
                    "/api/contact",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            email: email,

                            message: message

                        })

                    }
                );


            if (!response.ok) {

                let errorMessage =
                    "Unable to send message.";

                try {

                    const data =
                        await response.json();

                    if (data.message) {
                        errorMessage =
                            data.message;
                    }

                } catch (error) {
                    // Ignore
                }

                throw new Error(
                    errorMessage
                );
            }


            contactStatus.textContent =
                "Your message has been sent successfully.";

            contactStatus.style.color =
                "#2f765d";

            contactStatus.style.background =
                "#e9f4ef";


            contactForm.reset();


        } catch (error) {

            contactStatus.textContent =
                error.message;

            contactStatus.style.color =
                "#b94a48";

            contactStatus.style.background =
                "#faeceb";
        }

    }
);


/* =========================
   DATE FORMAT
   ========================= */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================
   HTML SAFETY
   ========================= */

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   INITIAL LOAD
   ========================= */

loadBooks();

loadMyBooks();
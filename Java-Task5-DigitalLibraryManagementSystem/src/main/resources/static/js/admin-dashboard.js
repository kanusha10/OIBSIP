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


if (currentUser.role !== "ADMIN") {

    window.location.replace(
        "/user-dashboard.html"
    );
}


/* =========================
   ELEMENTS
   ========================= */

const logoutBtn =
    document.getElementById("logoutBtn");

const addBookBtn =
    document.getElementById("addBookBtn");

const cancelBookBtn =
    document.getElementById("cancelBookBtn");

const bookFormContainer =
    document.getElementById(
        "bookFormContainer"
    );

const bookForm =
    document.getElementById("bookForm");

const bookFormTitle =
    document.getElementById(
        "bookFormTitle"
    );

const booksTableContainer =
    document.getElementById(
        "booksTableContainer"
    );

const membersContainer =
    document.getElementById(
        "membersContainer"
    );

const issuesContainer =
    document.getElementById(
        "issuesContainer"
    );

const queriesContainer =
    document.getElementById(
        "queriesContainer"
    );

const refreshMembersBtn =
    document.getElementById(
        "refreshMembersBtn"
    );

const refreshIssuesBtn =
    document.getElementById(
        "refreshIssuesBtn"
    );

const refreshQueriesBtn =
    document.getElementById(
        "refreshQueriesBtn"
    );


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
   BOOK FORM
   ========================= */

addBookBtn.addEventListener(
    "click",
    function () {

        resetBookForm();

        bookFormContainer.classList.remove(
            "hidden"
        );

        bookFormTitle.textContent =
            "Add Book";

        window.scrollTo({
            top:
                bookFormContainer.offsetTop - 30,

            behavior: "smooth"
        });

    }
);


cancelBookBtn.addEventListener(
    "click",
    function () {

        resetBookForm();

        bookFormContainer.classList.add(
            "hidden"
        );

    }
);


function resetBookForm() {

    bookForm.reset();

    document.getElementById(
        "bookId"
    ).value = "";

    bookFormTitle.textContent =
        "Add Book";
}


/* =========================
   SAVE BOOK
   ========================= */

bookForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const bookId =
            document.getElementById(
                "bookId"
            ).value;


        const book = {

            title:
                document.getElementById(
                    "bookTitle"
                ).value.trim(),

            author:
                document.getElementById(
                    "bookAuthor"
                ).value.trim(),

            category:
                document.getElementById(
                    "bookCategory"
                ).value.trim(),

            quantity:
                Number(
                    document.getElementById(
                        "bookQuantity"
                    ).value
                )

        };


        try {

            let response;


            if (bookId) {

                response =
                    await fetch(
                        "/api/books/"
                        + bookId,
                        {

                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(book)

                        }
                    );

            } else {

                response =
                    await fetch(
                        "/api/books",
                        {
                           method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body:
                                JSON.stringify(book)
                        }
                    );
            }


            if (!response.ok) {

                let message =
                    "Unable to save book.";

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
                bookId
                    ? "Book updated successfully."
                    : "Book added successfully."
            );


            resetBookForm();

            bookFormContainer.classList.add(
                "hidden"
            );


            loadBooks();


        } catch (error) {

            alert(error.message);
        }

    }
);


/* =========================
   LOAD BOOKS
   ========================= */

async function loadBooks() {

    booksTableContainer.innerHTML =
        '<div class="no-data">Loading books...</div>';


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

        booksTableContainer.innerHTML = `
            <div class="no-data">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


/* =========================
   DISPLAY BOOKS
   ========================= */

function displayBooks(books) {

    if (!books || books.length === 0) {

        booksTableContainer.innerHTML = `
            <div class="no-data">
                No books have been added yet.
            </div>
        `;

        return;
    }


    let html = `

        <table class="book-table">

            <thead>

                <tr>

                    <th>Title</th>

                    <th>Author</th>

                    <th>Category</th>

                    <th>Quantity</th>

                    <th>Availability</th>

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

    `;


    books.forEach(function (book) {

        const available =
            Number(book.quantity) > 0;


        html += `

            <tr>

                <td>
                    <strong>
                        ${escapeHtml(book.title)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(book.author)}
                </td>

                <td>
                    ${escapeHtml(book.category)}
                </td>

                <td>
                    ${book.quantity}
                </td>

                <td>

                    <span class="${
                        available
                            ? "status-available"
                            : "status-unavailable"
                    }">

                        ${
                            available
                                ? "Available"
                                : "Unavailable"
                        }

                    </span>

                </td>

                <td>

                    <button
                        class="edit-btn action-btn"
                        data-id="${book.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn action-btn"
                        data-id="${book.id}"
                    >
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });


    html += `

            </tbody>

        </table>

    `;


    booksTableContainer.innerHTML =
        html;


    document
        .querySelectorAll(".edit-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    editBook(
                        Number(button.dataset.id)
                    );

                }
            );

        });


    document
        .querySelectorAll(".delete-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    deleteBook(
                        Number(button.dataset.id)
                    );

                }
            );

        });
}


/* =========================
   EDIT BOOK
   ========================= */

async function editBook(bookId) {

    try {

        const response =
            await fetch(
                "/api/books/" + bookId
            );


        if (!response.ok) {
            throw new Error(
                "Unable to load book."
            );
        }


        const book =
            await response.json();


        document.getElementById(
            "bookId"
        ).value = book.id;


        document.getElementById(
            "bookTitle"
        ).value = book.title;


        document.getElementById(
            "bookAuthor"
        ).value = book.author;


        document.getElementById(
            "bookCategory"
        ).value = book.category;


        document.getElementById(
            "bookQuantity"
        ).value = book.quantity;


        bookFormTitle.textContent =
            "Edit Book";


        bookFormContainer.classList.remove(
            "hidden"
        );


        window.scrollTo({

            top:
                bookFormContainer.offsetTop - 30,

            behavior: "smooth"

        });


    } catch (error) {

        alert(error.message);
    }
}


/* =========================
   DELETE BOOK
   ========================= */

async function deleteBook(bookId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this book?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/books/" + bookId,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            let message =
                "Unable to delete book.";

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
            "Book deleted successfully."
        );


        loadBooks();


    } catch (error) {

        alert(error.message);
    }
}


/* =========================
   MEMBERS
   ========================= */

async function loadMembers() {

    membersContainer.innerHTML =
        '<div class="no-data">Loading members...</div>';


    try {

        const response =
            await fetch("/api/users");


        if (!response.ok) {
            throw new Error(
                "Unable to load members."
            );
        }


        const members =
            await response.json();


        displayMembers(members);


    } catch (error) {

        membersContainer.innerHTML = `
            <div class="no-data">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


function displayMembers(members) {

    if (!members || members.length === 0) {

        membersContainer.innerHTML = `
            <div class="no-data">
                No registered members found.
            </div>
        `;

        return;
    }


    let html = `

        <table class="member-table">

            <thead>

                <tr>

                    <th>ID</th>

                    <th>Username</th>

                    <th>Display Name</th>

                    <th>Role</th>

                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

    `;


    members.forEach(function (member) {

        html += `

            <tr>

                <td>
                    ${member.id}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(member.username)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(member.displayName)}
                </td>

                <td>
                    ${escapeHtml(member.role)}
                </td>

                <td>

                    <button
                        class="delete-btn action-btn"
                        data-member-id="${member.id}"
                    >
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });


    html += `

            </tbody>

        </table>

    `;


    membersContainer.innerHTML =
        html;


    document
        .querySelectorAll("[data-member-id]")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    deleteMember(
                        Number(
                            button.dataset.memberId
                        )
                    );

                }
            );

        });
}


/* =========================
   DELETE MEMBER
   ========================= */

async function deleteMember(memberId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this member?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/users/" + memberId,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            let message =
                "Unable to delete member.";

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
            "Member deleted successfully."
        );


        loadMembers();


    } catch (error) {

        alert(error.message);
    }
}


/* =========================
   ISSUED BOOKS
   ========================= */

async function loadIssuedBooks() {

    issuesContainer.innerHTML =
        '<div class="no-data">Loading issued books...</div>';


    try {

        const response =
            await fetch(
                "/api/issues/active"
            );


        if (!response.ok) {
            throw new Error(
                "Unable to load issued books."
            );
        }


        const issues =
            await response.json();


        displayIssuedBooks(issues);


    } catch (error) {

        issuesContainer.innerHTML = `
            <div class="no-data">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


function displayIssuedBooks(issues) {

    if (!issues || issues.length === 0) {

        issuesContainer.innerHTML = `
            <div class="no-data">
                No books are currently issued.
            </div>
        `;

        return;
    }


    let html = `

        <table class="issue-table">

            <thead>

                <tr>

                    <th>Member</th>

                    <th>Book</th>

                    <th>Issue Date</th>

                    <th>Due Date</th>

                    <th>Fine</th>

                    <th>Payment Status</th>

                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

    `;


    issues.forEach(function (issue) {

        const fine =
            Number(issue.fine || 0);


        let fineStatus;


        if (fine === 0) {

            fineStatus = `
                <span class="status-paid">
                    No Fine
                </span>
            `;

        } else if (issue.finePaid) {

            fineStatus = `
                <span class="status-paid">
                    Paid
                </span>
            `;

        } else {

            fineStatus = `
                <span class="status-pending">
                    Pending
                </span>
            `;
        }


        let action;


        if (
            fine > 0 &&
            !issue.finePaid
        ) {

            action = `

                <button
                    class="pay-btn"
                    data-issue-id="${issue.id}"
                >
                    Mark Paid
                </button>

            `;

        } else {

            action = `
                <span style="color:#71807b;">
                    —
                </span>
            `;
        }


        html += `

            <tr>

                <td>

                    <strong>
                        ${escapeHtml(
                            issue.user.displayName
                        )}
                    </strong>

                    <br>

                    <small>
                        ${escapeHtml(
                            issue.user.username
                        )}
                    </small>

                </td>

                <td>

                    <strong>
                        ${escapeHtml(
                            issue.book.title
                        )}
                    </strong>

                    <br>

                    <small>
                        ${escapeHtml(
                            issue.book.author
                        )}
                    </small>

                </td>

                <td>
                    ${formatDate(issue.issueDate)}
                </td>

                <td>
                    ${formatDate(issue.dueDate)}
                </td>

                <td>

                    ${
                        fine > 0
                            ? "₹" + fine
                            : "₹0"
                    }

                </td>

                <td>
                    ${fineStatus}
                </td>

                <td>
                    ${action}
                </td>

            </tr>

        `;

    });


    html += `

            </tbody>

        </table>

    `;


    issuesContainer.innerHTML =
        html;


    document
        .querySelectorAll("[data-issue-id]")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    markFinePaid(
                        Number(
                            button.dataset.issueId
                        )
                    );

                }
            );

        });
}


/* =========================
   MARK FINE PAID
   ========================= */

async function markFinePaid(issueId) {

    const confirmed =
        confirm(
            "Mark this fine as paid?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/issues/"
                + issueId
                + "/pay-fine",
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            let message =
                "Unable to update fine.";

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
            "Fine marked as paid."
        );


        loadIssuedBooks();


    } catch (error) {

        alert(error.message);
    }
}


/* =========================
   CONTACT QUERIES
   ========================= */

async function loadQueries() {

    queriesContainer.innerHTML =
        '<div class="no-data">Loading contact queries...</div>';


    try {

        const response =
            await fetch(
                "/api/contact"
            );


        if (!response.ok) {
            throw new Error(
                "Unable to load contact queries."
            );
        }


        const queries =
            await response.json();


        displayQueries(queries);


    } catch (error) {

        queriesContainer.innerHTML = `
            <div class="no-data">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


function displayQueries(queries) {

    if (!queries || queries.length === 0) {

        queriesContainer.innerHTML = `
            <div class="no-data">
                No contact queries found.
            </div>
        `;

        return;
    }


    let html = `

        <table class="query-table">

            <thead>

                <tr>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Message</th>

                    <th>Date</th>

                    <th>Status</th>

                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

    `;


    queries.forEach(function (query) {

        const resolved =
            query.resolved;


        html += `

            <tr>

                <td>
                    <strong>
                        ${escapeHtml(query.name)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(query.email)}
                </td>

                <td style="max-width:350px;">
                    ${escapeHtml(query.message)}
                </td>

                <td>
                    ${formatDateTime(
                        query.createdAt
                    )}
                </td>

                <td>

                    <span class="${
                        resolved
                            ? "status-resolved"
                            : "status-open"
                    }">

                        ${
                            resolved
                                ? "Resolved"
                                : "Open"
                        }

                    </span>

                </td>

                <td>

                    ${
                        resolved
                            ? `
                                <span
                                    style="
                                        color:#71807b;
                                    "
                                >
                                    Completed
                                </span>
                              `
                            : `
                                <button
                                    class="resolve-btn"
                                    data-query-id="${query.id}"
                                >
                                    Resolve
                                </button>
                              `
                    }

                </td>

            </tr>

        `;

    });


    html += `

            </tbody>

        </table>

    `;


    queriesContainer.innerHTML =
        html;


    document
        .querySelectorAll("[data-query-id]")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    resolveQuery(
                        Number(
                            button.dataset.queryId
                        )
                    );

                }
            );

        });
}


/* =========================
   RESOLVE QUERY
   ========================= */

async function resolveQuery(queryId) {

    try {

        const response =
            await fetch(
                "/api/contact/"
                + queryId
                + "/resolve",
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            let message =
                "Unable to resolve query.";

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


        loadQueries();


    } catch (error) {

        alert(error.message);
    }
}


/* =========================
   REFRESH BUTTONS
   ========================= */

refreshMembersBtn.addEventListener(
    "click",
    loadMembers
);

refreshIssuesBtn.addEventListener(
    "click",
    loadIssuedBooks
);

refreshQueriesBtn.addEventListener(
    "click",
    loadQueries
);


/* =========================
   DATE FORMAT
   ========================= */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    return new Date(
        dateString
    ).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function formatDateTime(dateString) {

    if (!dateString) {
        return "-";
    }


    return new Date(
        dateString
    ).toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",

            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* =========================
   HTML SAFETY
   ========================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================
   INITIAL LOAD
   ========================= */

loadBooks();

loadMembers();

loadIssuedBooks();

loadQueries();
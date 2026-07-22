// flask_app/static/home.js

// This function recieves the title, image, content, rating, and date_posted from when it is called in the HTML
function openModal(title, image, content, rating, date_finished, id, custom_data, category, tags_input, date_posted) {

    // It looks inside the HTML for an id review-modal
    const modal = document.getElementById("review-modal");
    // if there is no modal, stop here and return
    if (!modal) return;

    document.getElementById("delete-form").action = `/delete/${id}`;
    document.getElementById("edit-btn").href = `/edit/${id}`;



    // querySelector finds the matching class in the HTML code and the inside is set as what was passed in
    modal.querySelector(".modal-title").innerText = title;
    if (image) {
    modal.querySelector(".modal-image").src = image;
    modal.querySelector(".modal-image").style.display = "block";
    } else {
        modal.querySelector(".modal-image").style.display = "none";
    }
    modal.querySelector(".modal-review-content").innerText = content;


    // Metadata
    // assign a const for date and ratings
    const dateFinished = date_finished;
    const datePosted = date_posted;
    const stars = "★".repeat(parseInt(rating)) + "☆".repeat(5 - parseInt(rating));
    const tags = tags_input;
    const tagsArray = tags.split(",");

    //querySelector finds the modal metadata
    const metadata = modal.querySelector(".modal-metadata");
    // for authors, release dates
    const header = modal.querySelector(".modal-release-author");

    // for custom category reviews, and author/release info:
    if (custom_data) {
        customFields = JSON.parse(custom_data);
    } else {
        customFields = {};
    }

    let customHTML = '';
    let headerHTML = '';
    for (const [key, value] of Object.entries(customFields)) {
        if (value) {
            if (Object.keys(customFields).length > 1) {
            customHTML += `<span><strong>${key}:</strong> ${value} | </span>`;}
            else {
            customHTML += `<span><strong>${key}:</strong> ${value}</span>`;
            }
        }
    }

// for dates
let dateHTML = '';
if (dateFinished) {
dateHTML += `<p><strong>Date Finished: </strong>${dateFinished}</p>`;
}

// for tags
let tagsHTML = '';
let btnClass = "tag-btn";
if (tags) {
for (const tag of tagsArray) {
tagsHTML += `<button class="${btnClass}" id="${tag}" data-tag="${tag}">${tag}</button>`
}
}



// innerHTML used to edit header
if (headerHTML) {
header.innerHTML = `<p>${headerHTML}</p>`;
}
else {header.innerHTML = `${customHTML}`;}



    // Use the innerHTML to edit the metadata. The inner html will appear inside that specific div. stars and date go here
    // tags divs will only be created if tags are present
    metadata.innerHTML = `<div>
    <p>
    <strong>Rating:</strong>
    <span class="modal-stars">${stars}</span>
    </p>
    </div>
    <div>
    ${dateHTML}
    </div>
    <div>
    <p><strong>Date Posted: </strong>${datePosted}</p>
    </div>
    <div>
    <p><strong>Category: </strong>${category}</p>
    </div>

    ${tagsHTML ?
    `<div class="modal-tags">
    <p>
    <span class="tags-content">${tagsHTML}</span>
    </p>
    </div>
    ` : ''}

    `;

    // classList.add("show") means activate the modal.show in CSS?
    modal.style.display = "block";
    setTimeout(() => {
        modal.classList.add("show");
    }, 10);
}

// Function to close modal
function closeModal() {
    // create the const again, the review modal is the dark transparent background that covers the whole screen
    const modal = document.getElementById("review-modal");
    // deactivate the show in CSS
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);

}

// Makes sure the entire structure of the page loads
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("review-modal");
    const closeBtn = modal.querySelector(".close-btn");

    const deleteForm = document.getElementById("delete-form");

    const themeSelect = document.getElementById('theme-toggle');
    themeSelect.value = document.body.className;

    themeSelect.addEventListener('change', (event) => {
        const theme = event.target.value;

        if (theme === 'dark-mode') {
                document.body.classList = '';
                document.body.classList.add('dark-mode');
        }
        if (theme === 'purple') {
                document.body.classList = '';
                document.body.classList.add('purple');
        }
        if (theme === 'light-mode') {
                document.body.classList = '';
                document.body.classList.add('light-mode');
        }
        if (theme === 'light-green') {
                document.body.classList = '';
                document.body.classList.add('light-green');
        }
        if (theme === 'rose') {
                document.body.classList = '';
                document.body.classList.add('rose');
        }
        if (theme === 'sunset') {
                document.body.classList = '';
                document.body.classList.add('sunset');
        }

        if (theme === 'sunrise') {
                document.body.classList = '';
                document.body.classList.add('sunrise');
        }
        fetch('/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: theme })
    });
    });


    // Click x to close (call closeModal function)
    closeBtn.onclick = closeModal;

    // Click background to close
    window.onclick = function(event) {
    // if the modal is clicked, close it
        if (event.target == modal) {
            closeModal();
        }
    }

    deleteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this review?")) {
        deleteForm.submit();
    }
});

});




// when a button is clicked, change the color
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.sidebar-btn');

    // checks button on page reload so the current button is highlighted, only relevant after a button is clicked
    const params = new URLSearchParams(window.location.search);
    const currentCategory = params.get('category');
    const currentRating = params.get('rating');

    filterBtns.forEach(btn => {
            const textEl = btn.querySelector('.sidebar-text');
            const text = textEl ? textEl.innerText.trim() : "";

           if (currentCategory === "Movie" && text === "Movies" || currentCategory === "TV" && text === "TV Shows" ||
                currentCategory === "Book" && text === "Books" || currentRating && text === "⭐".repeat(parseInt(currentRating)) ||
                currentCategory === text) {
                btn.style.background = "var(--accent-color)";
                 btn.style.color = "var(--text-white)";}



        // click listener
        btn.addEventListener('click', () => {

            if (text == "All Reviews") window.location.href = "/home";
            else if (text === "Movies") window.location.href = "/home?category=Movie";
            else if (text === "TV Shows") window.location.href = "/home?category=TV";
            else if (text === "Books") window.location.href = "/home?category=Book";

            else if (text === "⭐") window.location.href = "/home?rating=1";
            else if (text === "⭐⭐") window.location.href = "/home?rating=2";
            else if (text === "⭐⭐⭐") window.location.href = "/home?rating=3";
            else if (text === "⭐⭐⭐⭐") window.location.href = "/home?rating=4";
            else if (text === "⭐⭐⭐⭐⭐") window.location.href = "/home?rating=5";

            // for custom categories, since the text should be the same as the params in the URL
            // TEST WITH CATEGORIES WITH SPACES!!
            else window.location.href = `/home?category=${text}`;


});


    });
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('tag-btn')) {
        const tag = event.target.dataset.tag;
        window.location.href = `/home?tag=${tag}`;
    }
});



// add ability to delete custom catgegories
document.addEventListener('DOMContentLoaded', () => {
// sidebar buttons for categories
const categoriesGroup = document.querySelector('.categories-group');

// hidden form at the end of html page
const deleteCategoryForm = document.getElementById("delete-category-form");

// right click a custom category butten, suppress the default event, and delete the category
categoriesGroup.addEventListener('contextmenu', function(event) {
const categoryBtn = event.target.closest('.custom-btn');


if (categoryBtn) {
    event.preventDefault();
    const categoryId = categoryBtn.dataset.categoryId;
    const categoryName = categoryBtn.dataset.categoryName;
    event.preventDefault();
    if (confirm(`Are you sure you want to delete the ${categoryName} category?`)) {
        deleteCategoryForm.action = `/delete_category/${categoryId}`;
        deleteCategoryForm.submit();
    }

};

});

});
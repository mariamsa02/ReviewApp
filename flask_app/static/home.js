// flask_app/static/home.js

// This function recieves the title, image, content, rating, and date_posted from when it is called in the HTML
function openModal(title, image, content, rating, date_posted) {
    // It looks inside the HTML for an id review-modal
    const modal = document.getElementById("review-modal");
    // if there is no modal, stop here and return
    if (!modal) return;


    // querySelector finds the matching class in the HTML code and the inside is set as what was passed in
    modal.querySelector(".modal-title").innerText = title;
    modal.querySelector(".modal-image").src = image;
    modal.querySelector(".modal-review-content").innerText = content;

    // Metadata
    // assign a const for date and ratings
    const date = date_posted
    const stars = "★".repeat(parseInt(rating)) + "☆".repeat(5 - parseInt(rating));
    //querySelector finds the modal metadata
    const metadata = modal.querySelector(".modal-metadata");
    // Use the innerHTML to edit the metadata. The inner html will appear inside that specific div. stars and date go here
    metadata.innerHTML = `<div>
    <p>
    <strong>Rating:</strong>
    <span class="modal-stars">
    ${stars}
    </span>
    </p>
    </div>
    <div>
    <p>
    <strong>Date Posted:</strong>
    ${date}
    </p>
    </div>`;

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

    // Click x to close (call closeModal function)
    closeBtn.onclick = closeModal;

    // Click background to close
    window.onclick = function(event) {
    // if the modal is clicked, close it
        if (event.target == modal) {
            closeModal();
        }
    }
});

// when a button is clicked, change the color
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.sidebar-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
           filterBtns.forEach(function(button) {
            // only one button can be the clicked color at a time
                button.style.background = "";
                });
            btn.style.background = "var(--accent-color)";
                    });
    });
});

// global state, so when the page is opened it's always on "Movie"
let currentCategory = "Movie";

document.addEventListener('DOMContentLoaded', () => {

    const themeSelect = document.getElementById('theme-toggle');
    themeSelect.value = document.body.className;

    themeSelect.addEventListener('change', (event) => {
        const theme = event.target.value;
        if (theme === 'light-mode') {
                document.body.classList.add('light-mode');
        }
        else {
                document.body.classList.remove('light-mode');
        }
        fetch('/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: theme })
    });

    });

    // element selectors
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('media-search');
    const categoryBtns = document.querySelectorAll('.sidebar-btn');
    const resultsDiv = document.getElementById('search-results');
    const searchTitle = document.querySelector('.search-title');
    if (searchTitle) searchTitle.innerHTML = `Search for ${currentCategory}`;


    // set default colors etc, so they can change when selected.
    const movieBtn = document.querySelector('.sidebar-btn');
    if (movieBtn) movieBtn.style.background = "var(--accent-color)";

    // when a category button is clicked, the results and search bar become empty
    categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        resultsDiv.innerHTML = "";
        searchInput.value = "";

        const textEl = btn.querySelector('.sidebar-text');
        const text = textEl ? textEl.innerText : "";

        categoryBtns.forEach(function(button) {
            button.style.background = "";
            button.style.color = "";
        });
        btn.style.background = "var(--accent-color)";
        btn.style.color = "var(--text-white)";

            // match the text to the category name. Should probably be the same.
            if (text === "Movies") currentCategory = "Movie";
            else if (text === "TV Shows") currentCategory = "TV";
            else if (text === "Books") currentCategory = "Book";

            if (searchTitle) searchTitle.innerHTML = `Search for ${text}`;
        });
    });


    if (searchBtn) {
        searchBtn.addEventListener('click', async () => {
            const query = searchInput.value.trim();
            if (!query) return;

            // URL for all categories
            const url = `/api/search?q=${encodeURIComponent(query)}&category=${currentCategory}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                displayResults(data, currentCategory);
            } catch (error) {
                console.error("Search error:", error);
            }
        });
    }

  searchInput.addEventListener("keypress", function(event) {
  // if the user presses the "Enter" key on the keyboard, the button is clicked
  if (event.key === "Enter") {
      document.getElementById("search-btn").click();
  }
});

}); // closes DOMContentLoaded

// display the search results
function displayResults(data, category) {
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = "";

    if (!data || data.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    data.forEach(item => {
        let title, imgPath;
        if (category === "Book") {
            title = item.volumeInfo.title;
            imgPath = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : '';
        } else {
            title = item.title || item.name;
            imgPath = item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : '';
        }

        const card = document.createElement('div');
        card.className = "results-card";
        card.innerHTML = `
        <img src="${imgPath}" alt="${title}" class="result-img">
         <div class="result-info">
                <h3 class="result-title">${title}</h3><br/>
            </div>

        `;

        card.querySelector('.result-img').addEventListener('click', () => {
            if (typeof selectMedia === "function") {
                selectMedia(title, imgPath, category);
            }
        });

        resultsDiv.appendChild(card);
    }); // closes data.forEach
} // closes displayResults


let selectedMedia = {};

// select media/selecting a poster
function selectMedia(title, imgPath, category) {
    // Store the selected media in global variable for later use
    selectedMedia = {title, imgPath, category,};

    document.querySelector('.dynamic-container').innerHTML = '';

    // show the review form with the selected media information
    showReviewForm();
}


function showReviewForm(){
    const container = document.querySelector('.dynamic-container');
        container.innerHTML = `
        <form method="POST" action="/new">
        <input type="hidden" name="title" value="${selectedMedia.title}">
        <input type="hidden" name="image_url" value="${selectedMedia.imgPath}">
        <input type="hidden" name="category" value="${selectedMedia.category}">

        <div class="review-header">
            <h1 class="title">${selectedMedia.title}</h1>
            <div class="media-flex">
               <!-- Left Column: Poster/Cover, Rating, Dates -->
                <div class="media-left">
                    <br/><br/>
                    <img src="${selectedMedia.imgPath}" alt="${selectedMedia.title}" class="media-img">
                    <div class="rating-dates">
                        <label>Rating:</label><br/>
                         <select id="rating" name="rating" required>
                            <option value="1">★☆☆☆☆</option>
                            <option value="2">★★☆☆☆</option>
                            <option value="3">★★★☆☆</option>
                            <option value="4">★★★★☆</option>
                            <option value="5">★★★★★</option>
                         </select>
                            <br/><br/>
                        <label>Finish Date:</label><br/>
                        <input type="date" id="date_finished" name="date_finished" placeholder="mm/dd/yyyy"/>
                    </div>
                </div>

                <!-- Right Column: Review, Tags -->
                <div class="media-right">
                    <h3>Review:</h3>
                    <textarea id="review-text" name="review_text"></textarea><br/><br/>

                    <label>Tags (comma separated):</label><br/>
                    <input type="text" id="tags-input" placeholder="e.g. fantasy, drama" /><br/><br/>

                    <button type="submit">Save Review</button>
                    <a href="{{ url_for('home') }}">Exit</a>

                </div>
            </div>
        </div>
            </form>

    `;
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.disabled = true);

}
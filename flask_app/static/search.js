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
    const categoryBtns = document.querySelectorAll('.searchable');
    const customBtns = document.querySelectorAll('.custom');

    const resultsDiv = document.getElementById('search-results');
    const searchTitle = document.querySelector('.search-title');
    if (searchTitle) searchTitle.innerHTML = `Search for ${currentCategory}`;

    customBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                window.location.href = `/custom-review/${id}`;
            });
        });



    // set default colors etc, so they can change when selected.
    const movieBtn = document.querySelector('.searchable');
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

            // LOADER
            loader = document.getElementById("loading");
            loader.style.display = 'block';
            startLoader();

            try {

                const response = await fetch(url);
                const data = await response.json();
                if (currentCategory === "Book") {
                displayBookResults(data, currentCategory);
                }
                else {
                displayMediaResults(data, currentCategory)
                }
            } catch (error) {
                console.error("Search error:", error);
            }
            finally {
                loader.style.display = 'none';
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

// Display book search results
function displayBookResults(data, category) {
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = "";

    if (!data || data.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

        data.forEach(item => {
        let title, author, published, imgPath;
            title = item.title;
            author = item.author_name ? item.author_name[0] : 'Unknown';
            published = item.first_publish_year;
            imgPath = item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg` : '';


        const card = document.createElement('div');
        card.className = "results-card";
        card.innerHTML = `
        <img src="${imgPath}" alt="${title}" class="result-img">
         <div class="result-info">
                <h3 class="result-title">${title}</h3>
                <div class="results-meta">
                <p class="result-author">${author}</p>
                <p class="result-published">${published}</p>
                </div>
            </div>

        `;

        const bookMeta = [author, published]

        card.querySelector('.result-img').addEventListener('click', () => {
                selectMedia(title, imgPath, category, bookMeta);
        });

        resultsDiv.appendChild(card);
    });
}




// display movie/tv search results
function displayMediaResults(data, category) {
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = "";

    if (!data || data.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    data.forEach(item => {
        let title, imgPath, release;
        title = item.title || item.name;
        imgPath = item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : '';
        if (category === "Movie") {
        release = item.release_date ? item.release_date.split('-')[0] : '';
        }
        else {
            release = item.first_air_date ? item.first_air_date.split('-')[0] : '';
        }

        const card = document.createElement('div');
        card.className = "results-card";
        card.innerHTML = `
        <img src="${imgPath}" alt="${title}" class="result-img">
         <div class="result-info">
                <h3 class="result-title">${title}</h3>
                <div class="results-meta">
                <p class="result-release">${release}</p>
                </div>
            </div>

        `;

        const mediaMeta = [release]
        card.querySelector('.result-img').addEventListener('click', () => {
                selectMedia(title, imgPath, category, mediaMeta);
        });

        resultsDiv.appendChild(card);
    }); // closes data.forEach
} // closes displayResults


let selectedMedia = {};

// select media/selecting a poster
function selectMedia(title, imgPath, category, meta) {
    const params = new URLSearchParams({
        title: title,
        image_url: imgPath,
        category: category,
        meta: meta,
    });
    window.location.href = `/new?${params}`;
}


// Typing effect for loading screen
var i = 0;
var text = 'Loading.....';
var speed = 150;
var loaderTimer = null;

function startLoader() {
    clearTimeout(loaderTimer);
    i = 0;
    document.getElementById("loading").innerHTML = "";
    document.getElementById("search-results").innerHTML = "";
    loaderTimer = setTimeout(loadType, 300)
}

function loadType() {
    if (i < text.length) {
        document.getElementById("loading").innerHTML += text.charAt(i);
        i++;
        setTimeout(loadType, speed);
    }
}

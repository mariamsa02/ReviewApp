document.addEventListener('DOMContentLoaded', () => {

    const themeSelect = document.getElementById('theme-toggle');
    themeSelect.value = document.body.className;

    themeSelect.addEventListener('change', (event) => {
        const theme = event.target.value;
        if (theme === 'light-mode') {
                document.body.classList = '';
                document.body.classList.add('light-mode');
        }
        if (theme === 'dark-mode') {
                document.body.classList = '';
                document.body.classList.add('dark-mode');
        }
        if (theme === 'dark-berry') {
                document.body.classList = '';
                document.body.classList.add('dark-berry');
        }
        if (theme === 'light-berry') {
                document.body.classList = '';
                document.body.classList.add('light-berry');
        }
        fetch('/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: theme })
    });

    });


    const button = document.getElementById('add-field');
    const field2 = document.getElementById('category-field2');
    const field3 = document.getElementById('category-field3');


button.addEventListener('click', function() {
    if (field2.style.display === "none" || field2.style.display === "") {
        field2.style.display = "block";
    } else if (field3.style.display === "none" || field3.style.display === "") {
        field3.style.display = "block";
        button.style.display = "none";
    }
});


const hasDateBtn = document.getElementById('has-date');
const hasDateInput = document.getElementById('has-date-input');
let hasDate = false;

hasDateBtn.addEventListener('click', function() {
    hasDate = !hasDate;
    hasDateInput.value = hasDate;

    if (hasDate) {
        hasDateBtn.style.background = "var(--border-color)";


    } else {
        hasDateBtn.style.background = "var(--bg-overlay)";

    }

});
});
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


    const button = document.getElementById('add-field');
    const field2 = document.getElementById('category-field2');
    const field3 = document.getElementById('category-field3');


button.addEventListener('click', function() {
    console.log("button clicked");
    console.log("field2 display:", field2.style.display);

    if (field2.style.display === "none" || field2.style.display === "") {
        field2.style.display = "block";
    } else if (field3.style.display === "none" || field3.style.display === "") {
        field3.style.display = "block";
        button.style.display = "none";
    }
});


    });

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

    });
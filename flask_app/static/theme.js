
document.addEventListener('DOMContentLoaded', () => {

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

    });
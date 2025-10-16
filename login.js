document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const resp = await fetch('https://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await resp.json();
        if (resp.ok && data.ok) {
            window.location.href = data.redirect;
        } else {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = data.message || 'Login failed';
            errorMessage.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Server error';
        errorMessage.style.display = 'block';
    }
});
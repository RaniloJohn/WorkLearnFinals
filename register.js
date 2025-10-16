// filepath: c:\Users\admin\OneDrive\Desktop\WORKLEARN FINALS\register.js
document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    try {
        const resp = await fetch('https://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password, confirmPassword })
        });
        const data = await resp.json();
        if (resp.ok && data.ok) {
            alert('Registration successful! Please log in.');
            window.location.href = 'LOGIN.html';
        } else {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = data.message || 'Registration failed';
            errorMessage.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Server error';
        errorMessage.style.display = 'block';
    }
});
document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Password strength validation
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength || !hasLetter || !hasNumber || !hasSymbol) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Password must be at least 8 characters long and include letters, numbers, and symbols.';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        const resp = await fetch('https://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password, confirmPassword })
        });
        const data = await resp.json();
        if (resp.ok && data.ok) {
            // Hide registration form and show verification message
            document.getElementById('register-form').style.display = 'none';
            const verificationMessage = document.createElement('div');
            verificationMessage.innerHTML = `
                <h3>Check your email for the verification code</h3>
                <p>We sent a 6-digit code to ${email}. Enter it below to complete registration.</p>
                <input type="text" id="verificationCode" placeholder="Enter 6-digit code" required>
                <button id="verify-btn">Verify Code</button>
                <div id="code-error" style="color: red; display: none;"></div>
            `;
            document.querySelector('.login-form').appendChild(verificationMessage);

            document.getElementById('verify-btn').addEventListener('click', async () => {
                const code = document.getElementById('verificationCode').value;
                const verifyResp = await fetch('https://localhost:3000/api/verify-code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, code })
                });
                const verifyData = await verifyResp.json();
                if (verifyResp.ok && verifyData.ok) {
                    alert('Account created successfully! Please log in.');
                    window.location.href = 'LOGIN.html';
                } else {
                    document.getElementById('code-error').textContent = verifyData.message || 'Verification failed';
                    document.getElementById('code-error').style.display = 'block';
                }
            });
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
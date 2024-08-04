document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorDiv = document.getElementById('error'); // Reference to error div

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://127.0.0.1:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    document.cookie = `token=${data.access_token}; path=/`;
                    window.location.href = 'index.html';
                } else {
                    const errorData = await response.json();
                    errorDiv.textContent = 'Login failed: ' + errorData.msg;
                    errorDiv.style.display = 'block'; // Show the error message
                }
            } catch (error) {
                console.error('Error:', error);
                errorDiv.textContent = 'An error occurred. Please try again.';
                errorDiv.style.display = 'block'; // Show the error message
            }
        });
    }
});

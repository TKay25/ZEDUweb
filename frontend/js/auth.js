// Authentication Functions

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');

    try {
        const response = await apiClient.login(email, password);

        // Store tokens
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        Storage.set('user', response.user);

        Toast.success('Login successful!');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        errorDiv.textContent = error.message || 'Login failed';
        errorDiv.classList.remove('d-none');
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = document.getElementById('userType').value;
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');

    // Validation
    if (!Validator.email(email)) {
        errorDiv.textContent = 'Invalid email format';
        errorDiv.classList.remove('d-none');
        return;
    }

    if (!Validator.password(password)) {
        errorDiv.textContent = 'Password must be at least 6 characters';
        errorDiv.classList.remove('d-none');
        return;
    }

    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.classList.remove('d-none');
        return;
    }

    try {
        const response = await apiClient.register({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            password,
            user_type: userType
        });

        successDiv.textContent = 'Registration successful! Redirecting to login...';
        successDiv.classList.remove('d-none');
        errorDiv.classList.add('d-none');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } catch (error) {
        errorDiv.textContent = error.message || 'Registration failed';
        errorDiv.classList.remove('d-none');
        successDiv.classList.add('d-none');
    }
}

async function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    Storage.remove('user');
    
    Toast.info('Logged out successfully');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Update UI based on authentication state
function updateAuthUI() {
    const userMenu = document.getElementById('userMenu');
    const authMenu = document.getElementById('authMenu');

    if (isAuthenticated()) {
        if (userMenu) userMenu.style.display = 'block';
        if (authMenu) authMenu.style.display = 'none';

        // Load current user
        loadCurrentUser();
    } else {
        if (userMenu) userMenu.style.display = 'none';
        if (authMenu) authMenu.style.display = 'block';
    }
}

async function loadCurrentUser() {
    try {
        const response = await apiClient.getCurrentUser();
        const user = response.user;
        Storage.set('user', user);
        
        // Update welcome message if on dashboard
        const welcomeName = document.getElementById('welcomeName');
        if (welcomeName) {
            welcomeName.textContent = `Welcome back, ${formatName(user.first_name, user.last_name)}!`;
        }
        
        return user;
    } catch (error) {
        console.error('Failed to load current user:', error);
    }
}

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

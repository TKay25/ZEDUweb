// Auth utilities
function showAuthLinks() {
    if (isLoggedIn()) {
        document.getElementById('userMenu').style.display = 'block';
        document.getElementById('authMenu').style.display = 'none';
    } else {
        document.getElementById('userMenu').style.display = 'none';
        document.getElementById('authMenu').style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', showAuthLinks);

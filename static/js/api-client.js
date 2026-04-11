// Simple API client
const API_BASE_URL = '/api';

async function apiCall(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('access_token');
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    const response = await fetch(API_BASE_URL + endpoint, options);
    
    if (!response.ok && response.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    }
    
    return await response.json();
}

// Auth helpers
function logout() {
    localStorage.removeItem('access_token');
    window.location.href = '/';
}

function isLoggedIn() {
    return localStorage.getItem('access_token') !== null;
}

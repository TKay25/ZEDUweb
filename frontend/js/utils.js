// Utility Functions

// Storage utilities
const Storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    }
};

// Toast/Alert notifications
class Toast {
    static show(message, type = 'info', duration = 3000) {
        const toastHTML = `
            <div class="alert alert-${type} alert-dismissible fade show position-fixed" style="top: 20px; right: 20px; z-index: 9999;" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', toastHTML);
        
        if (duration) {
            setTimeout(() => {
                const toasts = document.querySelectorAll('.position-fixed.alert');
                if (toasts.length > 0) {
                    toasts[toasts.length - 1].remove();
                }
            }, duration);
        }
    }

    static success(message) {
        this.show(message, 'success');
    }

    static error(message) {
        this.show(message, 'danger');
    }

    static info(message) {
        this.show(message, 'info');
    }

    static warning(message) {
        this.show(message, 'warning');
    }
}

// Format utilities
const Formatter = {
    date(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },

    datetime(dateString) {
        const options = { 
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },

    currency(amount, currency = '$') {
        return `${currency}${parseFloat(amount).toFixed(2)}`;
    },

    percentage(value, decimals = 1) {
        return `${parseFloat(value).toFixed(decimals)}%`;
    },

    rating(rating) {
        const stars = '⭐'.repeat(Math.round(rating));
        return `${stars} ${rating.toFixed(1)}`;
    }
};

// Validation utilities
const Validator = {
    email(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    password(password) {
        return password.length >= 6;
    },

    phone(phone) {
        const re = /^[\d\s\-\+\(\)]{7,}$/;
        return re.test(phone);
    },

    url(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    required(value) {
        return value !== null && value !== undefined && value !== '';
    }
};

// DOM utilities
const DOM = {
    byId(id) {
        return document.getElementById(id);
    },

    query(selector) {
        return document.querySelector(selector);
    },

    queryAll(selector) {
        return document.querySelectorAll(selector);
    },

    create(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.firstChild;
    },

    show(element) {
        if (typeof element === 'string') element = this.byId(element);
        if (element) element.style.display = '';
    },

    hide(element) {
        if (typeof element === 'string') element = this.byId(element);
        if (element) element.style.display = 'none';
    },

    toggleClass(element, className) {
        if (typeof element === 'string') element = this.byId(element);
        if (element) element.classList.toggle(className);
    },

    addClass(element, className) {
        if (typeof element === 'string') element = this.byId(element);
        if (element) element.classList.add(className);
    },

    removeClass(element, className) {
        if (typeof element === 'string') element = this.byId(element);
        if (element) element.classList.remove(className);
    }
};

// Debounce utility
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Throttle utility
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('access_token');
}

// Redirect if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Format name
function formatName(firstName, lastName) {
    return `${firstName} ${lastName}`.trim();
}

// Truncate text
function truncate(text, length = 50) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
}

// Get initiials for avatar
function getInitials(firstName, lastName) {
    return ((firstName || '')[0] + (lastName || '')[0]).toUpperCase();
}

// Dashboard Functions

let currentUser = null;
let studentProfile = null;

// Initialize dashboard
async function initDashboard() {
    requireAuth();
    
    try {
        // Load current user
        currentUser = await loadCurrentUser();
        
        // If student, load student profile
        if (currentUser.user_type === 'student') {
            await loadStudentProfile();
        }
        
        // Load dashboard data
        await loadDashboardData();
    } catch (error) {
        Toast.error('Failed to load dashboard: ' + error.message);
    }
}

async function loadStudentProfile() {
    try {
        // Get current user's student profile
        const response = await apiClient.get('/students');
        // This would need a proper endpoint to get current user's student profile
        // For now, we'll use a workaround
    } catch (error) {
        console.error('Error loading student profile:', error);
    }
}

async function loadDashboardData() {
    try {
        // Load courses
        const coursesResponse = await apiClient.listCourses(1, 5);
        const coursesCount = document.getElementById('coursesCount');
        if (coursesCount) {
            coursesCount.textContent = coursesResponse.total || 0;
        }

        // Load student info (if student)
        if (currentUser && currentUser.user_type === 'student') {
            // This would need proper endpoint
            const studyHoursEl = document.getElementById('studyHours');
            const gpaEl = document.getElementById('gpa');
            
            if (studyHoursEl) studyHoursEl.textContent = '0';
            if (gpaEl) gpaEl.textContent = '0.0';
        }

        // Load recent activity
        await loadRecentActivity();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadRecentActivity() {
    try {
        const activityDiv = document.getElementById('recentActivity');
        if (!activityDiv) return;

        const activity = [
            { type: 'course', text: 'Enrolled in Mathematics 101', time: '2 hours ago' },
            { type: 'session', text: 'Completed tutoring session with John', time: '1 day ago' },
            { type: 'assessment', text: 'Passed quiz: Algebra Basics (85%)', time: '3 days ago' }
        ];

        const html = activity.map(item => `
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                <div>
                    <p class="mb-0"><i class="fas fa-${getActivityIcon(item.type)}"></i> ${item.text}</p>
                    <small class="text-muted">${item.time}</small>
                </div>
            </div>
        `).join('');

        activityDiv.innerHTML = html;
    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

function getActivityIcon(type) {
    const icons = {
        course: 'book',
        session: 'video',
        assessment: 'clipboard-list'
    };
    return icons[type] || 'star';
}

function loadSection(section) {
    // Hide all sections
    const contentArea = document.getElementById('content-area');
    
    // Show selected section
    switch(section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'courses':
            // Load courses section
            break;
        case 'sessions':
            // Load sessions section
            break;
        case 'assessments':
            // Load assessments section
            break;
        case 'messages':
            // Load messages section
            break;
        case 'ai':
            // Load AI tools section
            break;
    }

    Toast.info(`Loading ${section}...`);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}

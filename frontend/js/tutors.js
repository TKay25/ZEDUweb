// Tutors Page Functions

let currentPage = 1;
let currentFilters = {};
let tutorModal = null;
let selectedTutorId = null;

// Initialize tutors page
async function initTutorsPage() {
    requireAuth();
    tutorModal = new bootstrap.Modal(document.getElementById('tutorModal'));
    
    await loadTutors();
    setupEventListeners();
}

async function loadTutors() {
    try {
        const response = await apiClient.listTutors(currentPage, 10, currentFilters.specialization);
        renderTutors(response.tutors);
    } catch (error) {
        Toast.error('Failed to load tutors: ' + error.message);
    }
}

function renderTutors(tutors) {
    const grid = document.getElementById('tutorsGrid');
    
    if (!tutors || tutors.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-muted">No tutors found</div>';
        return;
    }

    const html = tutors.map(tutor => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body text-center">
                    <div class="avatar mb-3">
                        <div class="bg-primary text-white rounded-circle" style="width: 80px; height: 80px; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 36px;">
                            ${getInitials(tutor.user.first_name, tutor.user.last_name)}
                        </div>
                    </div>
                    <h5 class="card-title">${formatName(tutor.user.first_name, tutor.user.last_name)}</h5>
                    <p class="text-muted">${tutor.specializations.join(', ')}</p>
                    
                    <div class="mb-3">
                        <div class="rating mb-2">
                            ${Formatter.rating(tutor.rating)}
                        </div>
                        <small class="text-muted">${tutor.total_sessions} sessions completed</small>
                    </div>

                    <div class="mb-3">
                        <small><strong>Experience:</strong> ${tutor.experience_years} years</small>
                    </div>

                    <div class="d-flex justify-content-between align-items-center">
                        <strong>${Formatter.currency(tutor.hourly_rate)}/hr</strong>
                        <span class="badge bg-success" id="availability-${tutor.id}">
                            ${tutor.is_available ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                </div>
                <div class="card-footer d-grid">
                    <button class="btn btn-primary" onclick="viewTutorDetails('${tutor.id}')">
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    grid.innerHTML = html;
}

async function viewTutorDetails(tutorId) {
    try {
        const response = await apiClient.getTutor(tutorId);
        const tutor = response.tutor;
        selectedTutorId = tutorId;

        const modalTitle = document.getElementById('tutorModalTitle');
        const modalBody = document.getElementById('tutorModalBody');

        modalTitle.textContent = formatName(tutor.user.first_name, tutor.user.last_name);
        
        const coursesResponse = await apiClient.getTutorCourses(tutorId);
        const coursesHTML = coursesResponse.courses.map(course => `
            <li>${course.title} (${course.subject})</li>
        `).join('');

        modalBody.innerHTML = `
            <div>
                <h6>About</h6>
                <p>${tutor.user.bio || 'No bio provided'}</p>
                
                <h6>Contact</h6>
                <ul class="list-unstyled">
                    <li><strong>Email:</strong> ${tutor.user.email}</li>
                    <li><strong>Phone:</strong> ${tutor.user.phone || 'Not provided'}</li>
                </ul>

                <h6>Qualifications</h6>
                <ul class="list-unstyled">
                    <li><strong>Specializations:</strong> ${tutor.specializations.join(', ')}</li>
                    <li><strong>Experience:</strong> ${tutor.experience_years} years</li>
                    <li><strong>Rating:</strong> ${Formatter.rating(tutor.rating)}</li>
                    <li><strong>Sessions Completed:</strong> ${tutor.total_sessions}</li>
                    <li><strong>Hourly Rate:</strong> ${Formatter.currency(tutor.hourly_rate)}</li>
                </ul>

                <h6>Courses Offered</h6>
                <ol>
                    ${coursesHTML || '<li>No courses yet</li>'}
                </ol>
            </div>
        `;

        tutorModal.show();
    } catch (error) {
        Toast.error('Failed to load tutor details: ' + error.message);
    }
}

async function bookSession() {
    if (!selectedTutorId) return;
    
    Toast.info('Session booking feature coming soon!');
    // Implementation would include a booking form/modal
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const specializationFilter = document.getElementById('specializationFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const ratingValue = document.getElementById('ratingValue');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            currentPage = 1;
            applyFilters();
        }, 500));
    }

    if (specializationFilter) {
        specializationFilter.addEventListener('change', () => {
            currentPage = 1;
            applyFilters();
        });
    }

    if (ratingFilter) {
        ratingFilter.addEventListener('input', (e) => {
            const rating = e.target.value;
            ratingValue.textContent = rating === '0' ? 'Rating: All' : `Rating: ${rating}+`;
            currentPage = 1;
            applyFilters();
        });
    }
}

function applyFilters() {
    currentFilters = {
        specialization: document.getElementById('specializationFilter')?.value || '',
        minRating: document.getElementById('ratingFilter')?.value || 0
    };
    loadTutors();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTutorsPage);
} else {
    initTutorsPage();
}

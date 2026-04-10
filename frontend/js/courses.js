// Courses Page Functions

let currentPage = 1;
let currentFilters = {};
let courseModal = null;
let selectedCourseId = null;

// Initialize courses page
async function initCoursesPage() {
    requireAuth();
    courseModal = new bootstrap.Modal(document.getElementById('courseModal'));
    
    await loadCourses();
    setupEventListeners();
}

async function loadCourses() {
    try {
        const response = await apiClient.listCourses(currentPage, 10, currentFilters);
        renderCourses(response.courses);
    } catch (error) {
        Toast.error('Failed to load courses: ' + error.message);
    }
}

function renderCourses(courses) {
    const grid = document.getElementById('coursesGrid');
    
    if (!courses || courses.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-muted">No courses found</div>';
        return;
    }

    const html = courses.map(course => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-img-top bg-primary" style="height: 200px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-book fa-3x text-white"></i>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${course.title}</h5>
                    <p class="card-text text-muted">${truncate(course.description, 100)}</p>
                    <div class="mb-3">
                        <span class="badge bg-info">${course.subject}</span>
                        <span class="badge bg-secondary">${course.level || 'All levels'}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">By ${course.tutor.name}</small>
                        <strong>${Formatter.currency(course.price)}</strong>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary w-100" onclick="viewCourseDetails('${course.id}')">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    grid.innerHTML = html;
}

async function viewCourseDetails(courseId) {
    try {
        const response = await apiClient.getCourse(courseId);
        const course = response.course;
        selectedCourseId = courseId;

        const modalTitle = document.getElementById('courseModalTitle');
        const modalBody = document.getElementById('courseModalBody');

        modalTitle.textContent = course.title;
        
        const lessonsHTML = course.lessons.map(lesson => `
            <li>${lesson.title}</li>
        `).join('');

        modalBody.innerHTML = `
            <div>
                <h6>Description</h6>
                <p>${course.description}</p>
                
                <h6>Details</h6>
                <ul class="list-unstyled">
                    <li><strong>Subject:</strong> ${course.subject}</li>
                    <li><strong>Level:</strong> ${course.level}</li>
                    <li><strong>Price:</strong> ${Formatter.currency(course.price)}</li>
                    <li><strong>Tutor:</strong> ${course.tutor.name}</li>
                    <li><strong>Rating:</strong> ${Formatter.rating(course.tutor.rating)}</li>
                </ul>
                
                <h6>Lessons</h6>
                <ol>
                    ${lessonsHTML}
                </ol>
            </div>
        `;

        courseModal.show();
    } catch (error) {
        Toast.error('Failed to load course details: ' + error.message);
    }
}

async function enrollCourse() {
    if (!selectedCourseId) return;

    try {
        await apiClient.enrollCourse(selectedCourseId);
        Toast.success('Successfully enrolled in course!');
        courseModal.hide();
        
        // Reload courses
        await loadCourses();
    } catch (error) {
        Toast.error('Enrollment failed: ' + error.message);
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const subjectFilter = document.getElementById('subjectFilter');
    const levelFilter = document.getElementById('levelFilter');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            currentPage = 1;
            applyFilters();
        }, 500));
    }

    if (subjectFilter) {
        subjectFilter.addEventListener('change', () => {
            currentPage = 1;
            applyFilters();
        });
    }

    if (levelFilter) {
        levelFilter.addEventListener('change', () => {
            currentPage = 1;
            applyFilters();
        });
    }
}

function applyFilters() {
    currentFilters = {
        subject: document.getElementById('subjectFilter')?.value || '',
        level: document.getElementById('levelFilter')?.value || ''
    };
    loadCourses();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCoursesPage);
} else {
    initCoursesPage();
}

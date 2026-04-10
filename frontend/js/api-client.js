// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Client
class APIClient {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('access_token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('access_token', token);
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    // Refresh token or redirect to login
                    localStorage.removeItem('access_token');
                    window.location.href = 'login.html';
                }
                throw new Error(data.message || 'API Error');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Auth endpoints
    async login(email, password) {
        return this.post('/auth/login', { email, password });
    }

    async register(data) {
        return this.post('/auth/register', data);
    }

    async getCurrentUser() {
        return this.get('/auth/me');
    }

    // Users endpoints
    async getUser(userId) {
        return this.get(`/users/${userId}`);
    }

    async updateUser(userId, data) {
        return this.put(`/users/${userId}`, data);
    }

    // Students endpoints
    async getStudent(studentId) {
        return this.get(`/students/${studentId}`);
    }

    async createStudentProfile(data) {
        return this.post('/students', data);
    }

    async getStudentCourses(studentId) {
        return this.get(`/students/${studentId}/courses`);
    }

    async getStudentPerformance(studentId) {
        return this.get(`/students/${studentId}/performance`);
    }

    // Tutors endpoints
    async listTutors(page = 1, perPage = 10, specialization = '') {
        let url = `/tutors?page=${page}&per_page=${perPage}`;
        if (specialization) url += `&specialization=${specialization}`;
        return this.get(url);
    }

    async getTutor(tutorId) {
        return this.get(`/tutors/${tutorId}`);
    }

    async getTutorCourses(tutorId) {
        return this.get(`/tutors/${tutorId}/courses`);
    }

    // Courses endpoints
    async listCourses(page = 1, perPage = 10, filters = {}) {
        let url = `/courses?page=${page}&per_page=${perPage}`;
        if (filters.subject) url += `&subject=${filters.subject}`;
        if (filters.level) url += `&level=${filters.level}`;
        return this.get(url);
    }

    async getCourse(courseId) {
        return this.get(`/courses/${courseId}`);
    }

    async createCourse(data) {
        return this.post('/courses', data);
    }

    async enrollCourse(courseId) {
        return this.post(`/courses/${courseId}/enroll`, {});
    }

    async addLesson(courseId, data) {
        return this.post(`/courses/${courseId}/lessons`, data);
    }

    // Sessions endpoints
    async createSession(data) {
        return this.post('/sessions', data);
    }

    async getSession(sessionId) {
        return this.get(`/sessions/${sessionId}`);
    }

    async updateSession(sessionId, data) {
        return this.put(`/sessions/${sessionId}`, data);
    }

    async getStudentSessions(studentId) {
        return this.get(`/sessions/student/${studentId}`);
    }

    async getTutorSessions(tutorId) {
        return this.get(`/sessions/tutor/${tutorId}`);
    }

    // Assessments endpoints
    async createAssessment(data) {
        return this.post('/assessments', data);
    }

    async getAssessment(assessmentId) {
        return this.get(`/assessments/${assessmentId}`);
    }

    async updateAssessment(assessmentId, data) {
        return this.put(`/assessments/${assessmentId}`, data);
    }

    async getStudentAssessments(studentId) {
        return this.get(`/assessments/student/${studentId}`);
    }

    // Messages endpoints
    async sendMessage(recipientId, content) {
        return this.post('/messages', { recipient_id: recipientId, content });
    }

    async getInbox(page = 1) {
        return this.get(`/messages/inbox?page=${page}`);
    }

    async getSent(page = 1) {
        return this.get(`/messages/sent?page=${page}`);
    }

    async getConversation(userId, page = 1) {
        return this.get(`/messages/conversation/${userId}?page=${page}`);
    }

    // AI endpoints
    async performancePredictor(data = {}) {
        return this.post('/ai/performance-predictor', data);
    }

    async quizGenerator(data) {
        return this.post('/ai/quiz-generator', data);
    }

    async summaryGenerator(data) {
        return this.post('/ai/summary-generator', data);
    }

    async getRecommendations(data = {}) {
        return this.post('/ai/recommendation-card', data);
    }
}

// Create global API client instance
const apiClient = new APIClient();

# ZEDU Backend - Flask API

A comprehensive educational platform backend built with Flask, SQLAlchemy, and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Course Management**: Create and manage courses with lessons
- **Student Management**: Track student progress and performance
- **Tutor Management**: Manage tutor profiles, specializations, and availability
- **Session Management**: Schedule and manage tutoring sessions
- **Assessments**: Track student assessments and grades
- **Messaging**: User-to-user messaging system
- **AI Features**: Performance prediction, quiz generation, and recommendations
- **RESTful API**: Complete REST API endpoints

## Tech Stack

- **Framework**: Flask 2.3.2
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0
- **Authentication**: Flask-JWT-Extended
- **Validation**: Marshmallow
- **Migration**: Flask-Migrate
- **Server**: Gunicorn

## Installation

### Requirements

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

### Setup

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize database**
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

6. **Run development server**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/<user_id>` - Get user profile
- `PUT /api/users/<user_id>` - Update user profile
- `GET /api/users` - List users
- `PUT /api/users/<user_id>/password` - Change password

### Students
- `POST /api/students` - Create student profile
- `GET /api/students/<student_id>` - Get student profile
- `PUT /api/students/<student_id>` - Update student profile
- `GET /api/students/<student_id>/courses` - Get enrolled courses
- `GET /api/students/<student_id>/performance` - Get performance metrics

### Tutors
- `GET /api/tutors` - List all tutors
- `GET /api/tutors/<tutor_id>` - Get tutor profile
- `POST /api/tutors` - Create tutor profile
- `GET /api/tutors/<tutor_id>/courses` - Get tutor's courses

### Courses
- `GET /api/courses` - List courses
- `GET /api/courses/<course_id>` - Get course details
- `POST /api/courses` - Create course (tutor only)
- `POST /api/courses/<course_id>/enroll` - Enroll in course
- `POST /api/courses/<course_id>/lessons` - Add lesson

### Sessions
- `POST /api/sessions` - Create tutoring session
- `GET /api/sessions/<session_id>` - Get session details
- `PUT /api/sessions/<session_id>` - Update session
- `GET /api/sessions/student/<student_id>` - Get student sessions
- `GET /api/sessions/tutor/<tutor_id>` - Get tutor sessions

### Assessments
- `POST /api/assessments` - Create assessment
- `GET /api/assessments/<assessment_id>` - Get assessment
- `PUT /api/assessments/<assessment_id>` - Update assessment
- `GET /api/assessments/student/<student_id>` - Get student assessments

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/inbox` - Get inbox
- `GET /api/messages/sent` - Get sent messages
- `GET /api/messages/conversation/<user_id>` - Get conversation

### AI Features
- `POST /api/ai/performance-predictor` - Predict performance
- `POST /api/ai/quiz-generator` - Generate quiz
- `POST /api/ai/summary-generator` - Generate summary
- `POST /api/ai/recommendation-card` - Get recommendations

## Database Models

- **User**: Base user model with authentication
- **Student**: Student-specific profile
- **Tutor**: Tutor profile with specializations
- **Parent**: Parent profile for guardians
- **School**: School organizations
- **Course**: Course offerings
- **CourseEnrollment**: Student course enrollments
- **Lesson**: Course lessons
- **TutorSession**: One-on-one sessions
- **Assessment**: Student assessments
- **Message**: User messages
- **Notification**: User notifications
- **AIPrediction**: AI-generated predictions

## Configuration

Edit `.env` file to configure:

```
FLASK_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/zedu
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production
```

## Deployment

### Docker

Build and run with Docker:

```bash
docker build -t zedu-backend .
docker run -p 5000:5000 --env-file .env zedu-backend
```

### Production

For production deployment:

1. Set `FLASK_ENV=production`
2. Use strong secret keys
3. Use PostgreSQL with proper backups
4. Run with Gunicorn: `gunicorn -w 4 -b 0.0.0.0:5000 app:app`
5. Set up reverse proxy (Nginx/Apache)
6. Use SSL/TLS certificates

## Development

### Running Tests

```bash
pytest
```

### Database Migrations

```bash
flask db migrate -m "Description"
flask db upgrade
```

## Troubleshooting

**Database Connection Error**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify credentials

**Import Errors**
- Activate virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`

**JWT Token Issues**
- Clear browser storage
- Check JWT_SECRET_KEY matches across deployments
- Verify token not expired

## Support

For issues and questions, please open an issue on the repository.

## License

MIT License - see LICENSE file for details

# ZEDU - Complete Setup Guide

This guide will help you set up the entire ZEDU educational platform system with Flask backend and Bootstrap frontend.

## System Architecture

```
┌─────────────────────────────────────────────────┐
│   Web Browser                                    │
│   - Bootstrap 5 UI                              │
│   - Vanilla JavaScript                          │
│   - Responsive Design                           │
└────────────┬────────────────────────────────────┘
             │ HTTP/REST API
             │
┌────────────▼────────────────────────────────────┐
│   Flask Backend (Python)                        │
│   - RESTful API endpoints                       │
│   - JWT Authentication                         │
│   - Email: localhost:5000                       │
└────────────┬────────────────────────────────────┘
             │ Database Connection
             │
┌────────────▼────────────────────────────────────┐
│   PostgreSQL Database                          │
│   - User data                                   │
│   - Courses, sessions, assessments              │
│   - Port: 5432                                  │
└─────────────────────────────────────────────────┘
```

## Prerequisites

- Python 3.8+
- Node.js 14+ (optional, for static server)
- PostgreSQL 12+
- Git
- Code Editor (VS Code recommended)

## Step 1: Backend Setup

### 1.1 Install PostgreSQL

**Windows**:
- Download from https://www.postgresql.org/download/windows/
- Install with default settings
- Remember username (postgres) and password

**Mac**:
```bash
brew install postgresql
brew services start postgresql
```

**Linux**:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 1.2 Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE zedu;
CREATE USER zedu_user WITH PASSWORD 'zedu_password';
ALTER ROLE zedu_user SET client_encoding TO 'utf8';
ALTER ROLE zedu_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE zedu_user SET default_transaction_deferrable TO on;
ALTER ROLE zedu_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE zedu TO zedu_user;
\q
```

### 1.3 Backend Installation

```bash
cd ZEDU/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your settings
# DATABASE_URL=postgresql://zedu_user:zedu_password@localhost:5432/zedu

# Initialize database
flask db upgrade

# Run backend server
flask run
```

The backend will run on: `http://localhost:5000`

## Step 2: Frontend Setup

### 2.1 Frontend Installation

```bash
cd ZEDU/frontend

# Option 1: Using Python
python -m http.server 3000

# Option 2: Using Node.js HTTP Server
npx http-server -p 3000

# Option 3: Using Python SimpleHTTPServer
python -m SimpleHTTPServer 3000
```

The frontend will run on: `http://localhost:3000`

## Step 3: Verify Installation

### 3.1 Test Backend

Open your browser and visit:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status": "ok", "message": "API is running"}
```

### 3.2 Test Frontend

Open your browser and visit:
```
http://localhost:3000
```

You should see the ZEDU home page.

## Step 4: First Time Usage

### 4.1 Register Account

1. Click "Sign Up" on the home page
2. Fill in your details
3. Select your role (Student, Tutor, or Parent)
4. Create account

### 4.2 Login

1. Go to Login page
2. Enter your email and password
3. You'll be redirected to dashboard

## Step 5: Test Features

### Student Features
- Browse courses
- Find tutors
- Enroll in courses
- View performance

### Tutor Features
- Create courses
- Add lessons
- Schedule sessions
- View students

## Troubleshooting

### Backend Issues

**Port 5000 in use**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**Database connection error**:
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Test connection: `psql -U zedu_user -d zedu`

**Module not found**:
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**CORS errors**:
- Ensure backend is running
- Check API_BASE_URL in js/api-client.js
- Verify backend CORS settings

**Page doesn't load**:
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Check browser console for errors

**Styling issues**:
- Hard refresh
- Check if css/styles.css is loaded
- Verify Bootstrap CDN is accessible

## Docker Setup (Alternative)

### Using Docker Compose

```bash
cd ZEDU

# Build and start all services
docker-compose up --build

# Access services:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Database: localhost:5432
```

## Development Workflow

### 1. Make Changes
- Edit backend routes in `backend/routes/`
- Edit frontend HTML/JS in `frontend/`

### 2. Test Changes
- Reload browser for frontend changes
- Restart Flask server for backend changes

### 3. Database Changes
```bash
cd backend

# Create migration
flask db migrate -m "Description"

# Apply migration
flask db upgrade
```

## File Structure Reference

```
ZEDU/
├── backend/
│   ├── app.py                 # Main Flask app
│   ├── config.py              # Configuration
│   ├── models.py              # Database models
│   ├── requirements.txt        # Python dependencies
│   ├── .env                   # Environment variables
│   ├── routes/                # API routes
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── students.py
│   │   ├── tutors.py
│   │   ├── courses.py
│   │   ├── sessions.py
│   │   ├── assessments.py
│   │   ├── messages.py
│   │   └── ai.py
│   └── Dockerfile
│
├── frontend/
│   ├── *.html                 # HTML pages
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── api-client.js
│   │   ├── utils.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── courses.js
│   │   └── tutors.js
│   └── Dockerfile
│
└── docker-compose.yml
```

## API Documentation

See `backend/README.md` for complete API documentation.

## Frontend Documentation

See `frontend/README.md` for complete frontend documentation.

## Production Deployment

### Environment Setup

1. Update `.env` with production values:
   - Change SECRET_KEY and JWT_SECRET_KEY
   - Use production database URL
   - Set FLASK_ENV=production

2. Backend deployment:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

3. Frontend deployment:
   - Build process not needed (vanilla JS)
   - Serve files using Nginx or Apache
   - Set up SSL certificate

### Database Backup

```bash
pg_dump -U zedu_user zedu > backup.sql
```

### Database Restore

```bash
psql -U zedu_user zedu < backup.sql
```

## Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Change JWT_SECRET_KEY in production
- [ ] Use strong database password
- [ ] Enable SSL/TLS
- [ ] Configure firewall
- [ ] Set up automated backups
- [ ] Enable rate limiting
- [ ] Set up logging and monitoring
- [ ] Regular security updates

## Support & Help

For detailed information:
- Backend: See `backend/README.md`
- Frontend: See `frontend/README.md`
- Main: See `README.md`

For issues:
1. Check the logs
2. Review troubleshooting section
3. Check browser console
4. Open an issue with details

## Next Steps

1. ✅ Install backend and frontend
2. ✅ Create test account
3. ✅ Explore features
4. Customize branding
5. Deploy to production
6. Set up monitoring
7. Configure additional features

Happy learning with ZEDU!

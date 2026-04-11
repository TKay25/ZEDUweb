# PostgreSQL Database Setup Guide for ZEDU

## Database Connection Details

**Production Database URL:**
```
postgresql://zeduweb_user:qdEe6bfJmlIHAknO2TVbum3SSm2kFvFV@dpg-d7cklfa8qa3s73e9podg-a.oregon-postgres.render.com/zeduweb
```

**Database Host:** dpg-d7cklfa8qa3s73e9podg-a.oregon-postgres.render.com  
**Database Name:** zeduweb  
**Username:** zeduweb_user  
**Port:** 5432 (default PostgreSQL)

---

## Database Schema Overview

The ZEDU platform uses 12 main tables with UUID primary keys and proper relationships:

### 1. **users** (Base table)
- Stores all user accounts (Students, Tutors, Parents, Admins)
- Fields: email, password_hash, first_name, last_name, phone, whatsapp_number, bio, user_type, is_active, is_verified
- Indexes: email (unique), user_type
- Relationships: 1-to-1 with Student/Tutor/Parent

### 2. **students** (Student-specific data)
- Links to User table via user_id
- Stores: grade_level, gpa, total_study_hours, school_id
- Relationships: Many-to-Many with Courses (through course_enrollments), 1-to-Many with TutorSessions, 1-to-Many with Assessments

### 3. **tutors** (Tutor-specific data)
- Links to User table via user_id
- Stores: specializations (JSON), experience_years, hourly_rate, rating, total_sessions, is_available
- Relationships: 1-to-Many with Courses, 1-to-Many with TutorSessions

### 4. **parents** (Parent-specific data)
- Links to User table via user_id
- Stores: relationship, student_ids (JSON array)
- Tracks guardians and their supervised students

### 5. **schools** (Educational institutions)
- Stores: name, email, phone, address, city, state, logo_url
- Relationships: 1-to-Many with Students

### 6. **courses** (Training programs)
- Created by Tutors
- Stores: title, description, subject, level, price, thumbnail
- Relationships: 1-to-Many with Lessons, 1-to-Many with CourseEnrollments

### 7. **course_enrollments** (Student course registrations)
- Junction table: Students ↔ Courses
- Stores: progress (0-100), status (active/completed/dropped), enrolled_at, completed_at
- Tracks student progress in courses

### 8. **lessons** (Course content)
- Belongs to Course
- Stores: title, description, content, video_url, order (sequence in course)
- Relationships: Many-to-1 with Courses

### 9. **tutor_sessions** (Live tutoring appointments)
- Stores: scheduled_at, duration_minutes, status, topic, notes
- Relationships: Many-to-1 with Tutor, Many-to-1 with Student
- Used for video call scheduling and tracking

### 10. **assessments** (Tests and evaluations)
- Stores: title, subject, score, total_marks, percentage, status, taken_at
- Relationships: Many-to-1 with Student
- Tracks performance metrics

### 11. **messages** (User communication)
- Stores: sender_id, recipient_id, content, is_read, created_at
- Relationships: Many-to-1 with User (both sender and recipient)
- Bidirectional messaging system

### 12. **notifications** (User alerts)
- Stores: user_id, title, content, type, is_read, created_at
- Relationships: Many-to-1 with User

### 13. **ai_predictions** (ML insights)
- Stores: student_id, prediction_type, data (JSON), created_at
- Relationships: Many-to-1 with Student
- Stores learner performance predictions and recommendations

---

## Table Relationships Diagram

```
users (Base)
├── students (1-to-1)
│   ├── course_enrollments (1-to-Many)
│   │   └── courses (Many-to-1)
│   │       └── lessons (1-to-Many)
│   ├── tutor_sessions (1-to-Many)
│   ├── assessments (1-to-Many)
│   └── ai_predictions (1-to-Many)
├── tutors (1-to-1)
│   ├── courses (1-to-Many)
│   └── tutor_sessions (1-to-Many)
├── parents (1-to-1)
└── (relationships for messaging and notifications)

schools
└── students (1-to-Many)

messages
├── sender → users
└── recipient → users

notifications
└── user → users
```

---

## Initialization Methods

### Method 1: Automatic Initialization (Recommended)

The database will automatically initialize on the **first request** to the Flask app:

```python
# In wsgi.py or zedu.py:
@app.before_request
def create_tables():
    db.create_all()
```

**Steps:**
1. Deploy the app to Render
2. Make any HTTP request to the deployed URL
3. Tables will be created automatically
4. Check Render logs to confirm

### Method 2: Manual Initialization Script

Use the provided `init_db.py` script:

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variable with database URL
export DATABASE_URL="postgresql://zeduweb_user:qdEe6bfJmlIHAknO2TVbum3SSm2kFvFV@dpg-d7cklfa8qa3s73e9podg-a.oregon-postgres.render.com/zeduweb"

# Run initialization
python init_db.py

# View details about created tables
python init_db.py init
```

**Optional commands:**
```bash
# Reset entire database (drop all tables and recreate)
python init_db.py reset

# Drop all tables (use with caution!)
python init_db.py drop
```

---

## Database Configuration

### Environment Variables

Add to `.env` file:

```env
DATABASE_URL=postgresql://zeduweb_user:qdEe6bfJmlIHAknO2TVbum3SSm2kFvFV@dpg-d7cklfa8qa3s73e9podg-a.oregon-postgres.render.com/zeduweb
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
```

### Render Environment Variables

In Render dashboard, add:
```
DATABASE_URL = postgresql://zeduweb_user:...@dpg-d7cklfa8qa3s73e9podg-a.oregon-postgres.render.com/zeduweb
```

---

## Database Features

### Indexes
- Email (unique on users table)
- User type status for quick filtering
- Foreign keys on all relationships (automatic)

### Cascading Deletes
- All child records are automatically deleted when parent is deleted
- Example: Deleting a user cascades to delete their student/tutor profile, courses, sessions, messages, etc.

### UUID Primary Keys
- All tables use UUID (Universally Unique Identifiers) as primary keys
- Better for distributed systems and privacy
- Format: `550e8400-e29b-41d4-a716-446655440000`

### Timestamps
- `created_at`: When record was first created (UTC)
- `updated_at`: Last modification time (UTC, auto-updates on changes)

### JSON Columns
- `specializations` (Tutor): Array of subject expertise
- `student_ids` (Parent): Array of student IDs they manage
- `data` (AIPrediction): Flexible storage for ML predictions

---

## Data Integrity Features

### Foreign Key Constraints
- Enforce referential integrity
- Prevent orphaned records
- Automatic cascading deletes where appropriate

### Unique Constraints
- Email addresses must be unique (prevents duplicate accounts)

### NOT NULL Constraints
- Critical fields: email, password_hash, first_name, last_name, user_type
- Ensures data quality and prevents incomplete records

### Default Values
- `is_active`: true (new users active by default)
- `is_verified`: false (email verification required)
- `created_at`: current UTC timestamp
- `updated_at`: current UTC timestamp

---

## Sample Data (Optional)

To add sample data after initialization:

```python
from zedu import create_app
from models import db, User, Student, Tutor, Course
from datetime import datetime

app = create_app("production")

with app.app_context():
    # Create a tutor
    tutor_user = User(
        email="prof.smith@zedu.com",
        first_name="John",
        last_name="Smith",
        phone="+14155551234",
        whatsapp_number="+14155551234",
        user_type="tutor"
    )
    tutor_user.set_password("TutorPassword123!")
    
    tutor = Tutor(
        user=tutor_user,
        specializations=["Mathematics", "Physics"],
        experience_years=5,
        hourly_rate=50.0,
        rating=4.8
    )
    
    # Create a course
    course = Course(
        tutor=tutor,
        title="Advanced Calculus",
        description="Master calculus concepts...",
        subject="Mathematics",
        level="Advanced",
        price=99.99
    )
    
    db.session.add(tutor_user)
    db.session.add(tutor)
    db.session.add(course)
    db.session.commit()
    
    print("✅ Sample data created!")
```

---

## Troubleshooting

### Connection Issues
```
Error: could not connect to server
```
- Check Render PostgreSQL status
- Verify DATABASE_URL is correct
- Ensure firewall allows connections on port 5432
- Check network configuration on Render

### Authentication Errors
```
Error: FATAL password authentication failed
```
- Verify username: `zeduweb_user`
- Check password in connection string
- Ensure no special characters are misinterpreted

### Table Already Exists
```
Error: relation "users" already exists
```
- This is normal on subsequent runs
- Use cascading relationships to clean up data
- Or manually drop tables with: `python init_db.py drop`

### Out of Connections
```
Error: sorry, too many clients already connected
```
- Render has connection pool limit
- Ensure connections are properly closed
- Restart Flask app: push new code to Render or click "Deploy" button

---

## Monitoring and Management

### View Database Size
```sql
SELECT
  schemaname AS schema,
  tablename AS table_name,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Count Records by Table
```sql
SELECT
  schemaname,
  tablename,
  n_live_tup as "Rows"
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

### View Active Connections
```sql
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;
```

---

## Best Practices

1. **Regular Backups**: Render provides automated backups - check Render dashboard
2. **Connection Pooling**: SQLAlchemy handles this automatically with `pool_pre_ping`
3. **Index Optimization**: Indexes on foreign keys and frequently queried columns
4. **Data Archiving**: Archive old records periodically to maintain performance
5. **Monitoring**: Monitor connection count and query performance
6. **Scaling**: Render PostgreSQL supports read replicas for scaling reads

---

## Quick Reference

| Feature | Status | Notes |
|---------|--------|-------|
| UUID Primary Keys | ✅ | All tables use UUID v4 |
| Foreign Keys | ✅ | All relationships enforced |
| Cascading Deletes | ✅ | Automatic cleanup |
| Indexes | ✅ | On critical columns |
| Timestamps | ✅ | Auto-managed by SQLAlchemy |
| JSON Support | ✅ | Tutor specializations, parent students |
| Full-text Search | ⏳ | Can be added via Postgres extensions |
| Backups | ✅ | Render automated backups |

---

**Last Updated:** April 11, 2026  
**Database Version:** PostgreSQL 14+  
**SQLAlchemy Version:** 1.4.52+

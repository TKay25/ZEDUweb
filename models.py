from datetime import datetime
import uuid
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy.dialects.postgresql import UUID

db = SQLAlchemy()
bcrypt = Bcrypt()


class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    whatsapp_number = db.Column(db.String(20))
    avatar_url = db.Column(db.String(500))
    bio = db.Column(db.Text)
    user_type = db.Column(db.String(20), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    student = db.relationship("Student", backref="user", uselist=False, cascade="all, delete-orphan")
    tutor = db.relationship("Tutor", backref="user", uselist=False, cascade="all, delete-orphan")
    parent = db.relationship("Parent", backref="user", uselist=False, cascade="all, delete-orphan")
    messages = db.relationship("Message", backref="sender", foreign_keys="Message.sender_id")
    notifications = db.relationship("Notification", backref="user", cascade="all, delete-orphan")
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "whatsapp_number": self.whatsapp_number,
            "avatar_url": self.avatar_url,
            "user_type": self.user_type,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat()
        }


class Student(db.Model):
    __tablename__ = "students"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    grade_level = db.Column(db.String(50))
    school_id = db.Column(UUID(as_uuid=True), db.ForeignKey("schools.id", ondelete="SET NULL"))
    gpa = db.Column(db.Float, default=0.0)
    total_study_hours = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    enrollments = db.relationship("CourseEnrollment", backref="student", cascade="all, delete-orphan")
    tutor_sessions = db.relationship("TutorSession", backref="student", cascade="all, delete-orphan")
    assessments = db.relationship("Assessment", backref="student", cascade="all, delete-orphan")
    school = db.relationship("School", backref="students")


class Tutor(db.Model):
    __tablename__ = "tutors"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    specializations = db.Column(db.JSON)
    experience_years = db.Column(db.Integer, default=0)
    hourly_rate = db.Column(db.Float)
    rating = db.Column(db.Float, default=5.0)
    total_sessions = db.Column(db.Integer, default=0)
    is_available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    courses = db.relationship("Course", backref="tutor", cascade="all, delete-orphan")
    sessions = db.relationship("TutorSession", backref="tutor", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "specializations": self.specializations,
            "experience_years": self.experience_years,
            "hourly_rate": self.hourly_rate,
            "rating": self.rating,
            "total_sessions": self.total_sessions,
            "is_available": self.is_available,
            "created_at": self.created_at.isoformat()
        }


class Parent(db.Model):
    __tablename__ = "parents"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    relationship = db.Column(db.String(100))
    student_ids = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class School(db.Model):
    __tablename__ = "schools"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    logo_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Course(db.Model):
    __tablename__ = "courses"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tutor_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tutors.id", ondelete="CASCADE"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    subject = db.Column(db.String(100), nullable=False)
    level = db.Column(db.String(50))
    price = db.Column(db.Float)
    thumbnail = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    enrollments = db.relationship("CourseEnrollment", backref="course", cascade="all, delete-orphan")
    lessons = db.relationship("Lesson", backref="course", cascade="all, delete-orphan")


class CourseEnrollment(db.Model):
    __tablename__ = "course_enrollments"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = db.Column(UUID(as_uuid=True), db.ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    course_id = db.Column(UUID(as_uuid=True), db.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    progress = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(50), default="active")
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)


class Lesson(db.Model):
    __tablename__ = "lessons"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = db.Column(UUID(as_uuid=True), db.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    content = db.Column(db.Text)
    video_url = db.Column(db.String(500))
    order = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class TutorSession(db.Model):
    __tablename__ = "tutor_sessions"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tutor_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tutors.id", ondelete="CASCADE"), nullable=False)
    student_id = db.Column(UUID(as_uuid=True), db.ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    scheduled_at = db.Column(db.DateTime, nullable=False)
    duration_minutes = db.Column(db.Integer, default=60)
    status = db.Column(db.String(50), default="scheduled")
    topic = db.Column(db.String(255))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Assessment(db.Model):
    __tablename__ = "assessments"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = db.Column(UUID(as_uuid=True), db.ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    subject = db.Column(db.String(100))
    score = db.Column(db.Float)
    total_marks = db.Column(db.Float, default=100)
    percentage = db.Column(db.Float)
    status = db.Column(db.String(50))
    taken_at = db.Column(db.DateTime, default=datetime.utcnow)


class Message(db.Model):
    __tablename__ = "messages"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sender_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    recipient_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    recipient = db.relationship("User", foreign_keys=[recipient_id])


class Notification(db.Model):
    __tablename__ = "notifications"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text)
    type = db.Column(db.String(50))
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class AIPrediction(db.Model):
    __tablename__ = "ai_predictions"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = db.Column(UUID(as_uuid=True), db.ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    prediction_type = db.Column(db.String(100))
    data = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class CourseReview(db.Model):
    __tablename__ = "course_reviews"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = db.Column(UUID(as_uuid=True), db.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    student_id = db.Column(UUID(as_uuid=True), db.ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    rating = db.Column(db.Float, nullable=False)  # 1-5
    title = db.Column(db.String(255))
    comment = db.Column(db.Text)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    course = db.relationship("Course", backref="reviews")
    student = db.relationship("Student", backref="reviews")


class TutorEarnings(db.Model):
    __tablename__ = "tutor_earnings"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tutor_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tutors.id", ondelete="CASCADE"), nullable=False)
    course_enrollment_id = db.Column(UUID(as_uuid=True), db.ForeignKey("course_enrollments.id", ondelete="SET NULL"))
    session_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tutor_sessions.id", ondelete="SET NULL"))
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(50), default="course")  # 'course', 'session', 'refund'
    status = db.Column(db.String(50), default="pending")  # 'pending', 'completed', 'withdrawn'
    transaction_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    tutor = db.relationship("Tutor", backref="earnings")


class StudentActivity(db.Model):
    __tablename__ = "student_activity"
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tutor_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tutors.id", ondelete="CASCADE"), nullable=False)
    student_id = db.Column(UUID(as_uuid=True), db.ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    activity_type = db.Column(db.String(100), nullable=False)  # 'enrollment', 'submission', 'question', 'review'
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    related_entity_id = db.Column(UUID(as_uuid=True))  # course_id, submission_id, etc
    status = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    tutor = db.relationship("Tutor", backref="student_activities")
    student = db.relationship("Student", backref="activities")

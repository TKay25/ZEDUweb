from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Course, CourseEnrollment, Lesson, Tutor
from uuid import uuid4

courses_bp = Blueprint("courses", __name__)


@courses_bp.route("", methods=["GET"])
def list_courses():
    """List all courses"""
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    subject = request.args.get("subject")
    level = request.args.get("level")
    
    query = Course.query
    
    if subject:
        query = query.filter_by(subject=subject)
    if level:
        query = query.filter_by(level=level)
    
    courses = query.paginate(page=page, per_page=per_page)
    
    result = []
    for course in courses.items:
        result.append({
            "id": str(course.id),
            "title": course.title,
            "subject": course.subject,
            "level": course.level,
            "price": course.price,
            "tutor": {
                "id": str(course.tutor.id),
                "name": f"{course.tutor.user.first_name} {course.tutor.user.last_name}"
            }
        })
    
    return {
        "courses": result,
        "total": courses.total,
        "pages": courses.pages,
        "current_page": page
    }, 200


@courses_bp.route("/<course_id>", methods=["GET"])
def get_course(course_id):
    """Get course details"""
    course = Course.query.get(course_id)
    
    if not course:
        return {"message": "Course not found"}, 404
    
    lessons = Lesson.query.filter_by(course_id=course_id).all()
    
    return {
        "course": {
            "id": str(course.id),
            "title": course.title,
            "description": course.description,
            "subject": course.subject,
            "level": course.level,
            "price": course.price,
            "thumbnail": course.thumbnail,
            "tutor": {
                "id": str(course.tutor.id),
                "name": f"{course.tutor.user.first_name} {course.tutor.user.last_name}",
                "rating": course.tutor.rating
            },
            "lessons": [
                {
                    "id": str(lesson.id),
                    "title": lesson.title,
                    "order": lesson.order
                }
                for lesson in lessons
            ]
        }
    }, 200


@courses_bp.route("", methods=["POST"])
@jwt_required()
def create_course():
    """Create a new course (tutor only)"""
    current_user_id = get_jwt_identity()
    tutor = Tutor.query.filter_by(user_id=current_user_id).first()
    
    if not tutor:
        return {"message": "You must be a tutor to create a course"}, 403
    
    data = request.get_json()
    
    course = Course(
        tutor_id=tutor.id,
        title=data.get("title"),
        description=data.get("description"),
        subject=data.get("subject"),
        level=data.get("level"),
        price=data.get("price", 0),
        thumbnail=data.get("thumbnail")
    )
    
    try:
        db.session.add(course)
        db.session.commit()
        return {"message": "Course created", "course_id": str(course.id)}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Creation failed: {str(e)}"}, 500


@courses_bp.route("/<course_id>/enroll", methods=["POST"])
@jwt_required()
def enroll_course(course_id):
    """Enroll student in course"""
    from models import Student
    
    current_user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=current_user_id).first()
    
    if not student:
        return {"message": "Student profile required"}, 400
    
    course = Course.query.get(course_id)
    if not course:
        return {"message": "Course not found"}, 404
    
    # Check if already enrolled
    if CourseEnrollment.query.filter_by(student_id=student.id, course_id=course_id).first():
        return {"message": "Already enrolled in this course"}, 409
    
    enrollment = CourseEnrollment(
        student_id=student.id,
        course_id=course_id,
        status="active"
    )
    
    try:
        db.session.add(enrollment)
        db.session.commit()
        return {"message": "Enrolled in course successfully", "enrollment_id": str(enrollment.id)}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Enrollment failed: {str(e)}"}, 500


@courses_bp.route("/<course_id>/lessons", methods=["POST"])
@jwt_required()
def add_lesson(course_id):
    """Add lesson to course (tutor only)"""
    current_user_id = get_jwt_identity()
    course = Course.query.get(course_id)
    
    if not course:
        return {"message": "Course not found"}, 404
    
    if str(course.tutor.user_id) != current_user_id:
        return {"message": "Unauthorized"}, 403
    
    data = request.get_json()
    
    lesson = Lesson(
        course_id=course_id,
        title=data.get("title"),
        description=data.get("description"),
        content=data.get("content"),
        video_url=data.get("video_url"),
        order=data.get("order", 0)
    )
    
    try:
        db.session.add(lesson)
        db.session.commit()
        return {"message": "Lesson added", "lesson_id": str(lesson.id)}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Creation failed: {str(e)}"}, 500

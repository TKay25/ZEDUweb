from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, Student, User
import uuid

students_bp = Blueprint("students", __name__)


@students_bp.route("", methods=["POST"])
@jwt_required()
def create_student():
    """Create student profile"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return {"message": "User not found"}, 404
    
    data = request.get_json()
    
    student = Student(
        user_id=current_user_id,
        grade_level=data.get("grade_level"),
        school_id=data.get("school_id")
    )
    
    try:
        db.session.add(student)
        db.session.commit()
        return {"message": "Student profile created", "student_id": str(student.id)}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Creation failed: {str(e)}"}, 500


@students_bp.route("/<student_id>", methods=["GET"])
def get_student(student_id):
    """Get student profile"""
    student = Student.query.get(student_id)
    
    if not student:
        return {"message": "Student not found"}, 404
    
    return {
        "student": {
            "id": str(student.id),
            "user_id": str(student.user_id),
            "grade_level": student.grade_level,
            "gpa": student.gpa,
            "total_study_hours": student.total_study_hours,
            "user": student.user.to_dict()
        }
    }, 200


@students_bp.route("/<student_id>", methods=["PUT"])
@jwt_required()
def update_student(student_id):
    """Update student profile"""
    current_user_id = get_jwt_identity()
    student = Student.query.get(student_id)
    
    if not student:
        return {"message": "Student not found"}, 404
    
    if str(student.user_id) != current_user_id:
        return {"message": "Unauthorized"}, 403
    
    data = request.get_json()
    
    student.grade_level = data.get("grade_level", student.grade_level)
    student.gpa = data.get("gpa", student.gpa)
    
    try:
        db.session.commit()
        return {"message": "Student updated"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Update failed: {str(e)}"}, 500


@students_bp.route("/<student_id>/courses", methods=["GET"])
def get_student_courses(student_id):
    """Get student's enrolled courses"""
    from ..models import CourseEnrollment, Course
    
    student = Student.query.get(student_id)
    if not student:
        return {"message": "Student not found"}, 404
    
    enrollments = CourseEnrollment.query.filter_by(student_id=student_id).all()
    
    courses = []
    for enrollment in enrollments:
        courses.append({
            "course_id": str(enrollment.course_id),
            "title": enrollment.course.title,
            "subject": enrollment.course.subject,
            "progress": enrollment.progress,
            "status": enrollment.status,
            "enrolled_at": enrollment.enrolled_at.isoformat()
        })
    
    return {"courses": courses}, 200


@students_bp.route("/<student_id>/performance", methods=["GET"])
def get_student_performance(student_id):
    """Get student performance metrics"""
    from ..models import Assessment
    
    student = Student.query.get(student_id)
    if not student:
        return {"message": "Student not found"}, 404
    
    assessments = Assessment.query.filter_by(student_id=student_id).all()
    
    if not assessments:
        return {
            "total_assessments": 0,
            "average_score": 0,
            "assessments": []
        }, 200
    
    avg_score = sum(a.percentage or 0 for a in assessments) / len(assessments)
    
    return {
        "total_assessments": len(assessments),
        "average_score": round(avg_score, 2),
        "gpa": student.gpa,
        "total_study_hours": student.total_study_hours,
        "assessments": [
            {
                "title": a.title,
                "subject": a.subject,
                "score": a.score,
                "percentage": a.percentage,
                "taken_at": a.taken_at.isoformat()
            }
            for a in assessments
        ]
    }, 200

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Student, User
from datetime import datetime

students_bp = Blueprint("students", __name__)


@students_bp.route("", methods=["GET"])
@jwt_required()
def get_students():
    """Get all students"""
    students = Student.query.all()
    return {"students": [s.to_dict() for s in students]}, 200


@students_bp.route("/<int:student_id>", methods=["GET"])
@jwt_required()
def get_student(student_id):
    """Get student by ID"""
    student = Student.query.get(student_id)
    if not student:
        return {"message": "Student not found"}, 404
    return {"student": student.to_dict()}, 200


@students_bp.route("", methods=["POST"])
@jwt_required()
def create_student():
    """Create student record"""
    data = request.get_json()
    
    try:
        student = Student(
            user_id=data.get("user_id"),
            grade=data.get("grade"),
            enrollment_date=datetime.utcnow()
        )
        db.session.add(student)
        db.session.commit()
        return {"message": "Student created", "student": student.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Creation failed: {str(e)}"}, 500


@students_bp.route("/<int:student_id>", methods=["PUT"])
@jwt_required()
def update_student(student_id):
    """Update student"""
    student = Student.query.get(student_id)
    if not student:
        return {"message": "Student not found"}, 404
    
    data = request.get_json()
    student.grade = data.get("grade", student.grade)
    
    try:
        db.session.commit()
        return {"message": "Student updated", "student": student.to_dict()}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Update failed: {str(e)}"}, 500


@students_bp.route("/<int:student_id>", methods=["DELETE"])
@jwt_required()
def delete_student(student_id):
    """Delete student"""
    student = Student.query.get(student_id)
    if not student:
        return {"message": "Student not found"}, 404
    
    try:
        db.session.delete(student)
        db.session.commit()
        return {"message": "Student deleted"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Delete failed: {str(e)}"}, 500

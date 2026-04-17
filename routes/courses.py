from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Course, Tutor
from datetime import datetime

courses_bp = Blueprint("courses", __name__)


@courses_bp.route("", methods=["GET"])
def get_courses():
    """Get all courses"""
    courses = Course.query.all()
    return {"courses": [c.to_dict() for c in courses]}, 200


@courses_bp.route("/<int:course_id>", methods=["GET"])
def get_course(course_id):
    """Get course by ID"""
    course = Course.query.get(course_id)
    if not course:
        return {"message": "Course not found"}, 404
    return {"course": course.to_dict()}, 200


@courses_bp.route("", methods=["POST"])
@jwt_required()
def create_course():
    """Create course"""
    data = request.get_json()
    
    try:
        course = Course(
            title=data.get("title"),
            description=data.get("description"),
            tutor_id=data.get("tutor_id"),  # Pass as string, SQLAlchemy will convert
            subject=data.get("subject"),
            level=data.get("level")
        )
        db.session.add(course)
        db.session.flush()  # Flush to ensure consistency
        db.session.commit()
        return {"message": "Course created", "course": course.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return {"message": f"Creation failed: {str(e)}"}, 500


@courses_bp.route("/<int:course_id>", methods=["PUT"])
@jwt_required()
def update_course(course_id):
    """Update course"""
    course = Course.query.get(course_id)
    if not course:
        return {"message": "Course not found"}, 404
    
    data = request.get_json()
    course.title = data.get("title", course.title)
    course.description = data.get("description", course.description)
    course.subject = data.get("subject", course.subject)
    course.level = data.get("level", course.level)
    
    try:
        db.session.commit()
        return {"message": "Course updated", "course": course.to_dict()}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Update failed: {str(e)}"}, 500


@courses_bp.route("/<int:course_id>", methods=["DELETE"])
@jwt_required()
def delete_course(course_id):
    """Delete course"""
    course = Course.query.get(course_id)
    if not course:
        return {"message": "Course not found"}, 404
    
    try:
        db.session.delete(course)
        db.session.commit()
        return {"message": "Course deleted"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Delete failed: {str(e)}"}, 500

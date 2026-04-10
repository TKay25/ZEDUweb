from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Assessment, Student
from datetime import datetime

assessments_bp = Blueprint("assessments", __name__)


@assessments_bp.route("", methods=["POST"])
@jwt_required()
def create_assessment():
    """Create an assessment"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    student_id = data.get("student_id")
    student = Student.query.get(student_id)
    
    if not student:
        return {"message": "Student not found"}, 404
    
    # Check authorization
    if str(student.user_id) != current_user_id:
        # Could be a tutor creating assessment for student
        pass
    
    assessment = Assessment(
        student_id=student_id,
        title=data.get("title"),
        subject=data.get("subject"),
        score=data.get("score", 0),
        total_marks=data.get("total_marks", 100),
        status=data.get("status", "pending")
    )
    
    # Calculate percentage
    if assessment.total_marks > 0:
        assessment.percentage = (assessment.score / assessment.total_marks) * 100
    
    try:
        db.session.add(assessment)
        db.session.commit()
        return {"message": "Assessment created", "assessment_id": str(assessment.id)}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Creation failed: {str(e)}"}, 500


@assessments_bp.route("/<assessment_id>", methods=["GET"])
def get_assessment(assessment_id):
    """Get assessment details"""
    assessment = Assessment.query.get(assessment_id)
    
    if not assessment:
        return {"message": "Assessment not found"}, 404
    
    return {
        "assessment": {
            "id": str(assessment.id),
            "title": assessment.title,
            "subject": assessment.subject,
            "score": assessment.score,
            "total_marks": assessment.total_marks,
            "percentage": assessment.percentage,
            "status": assessment.status,
            "taken_at": assessment.taken_at.isoformat()
        }
    }, 200


@assessments_bp.route("/<assessment_id>", methods=["PUT"])
@jwt_required()
def update_assessment(assessment_id):
    """Update assessment (grade)"""
    assessment = Assessment.query.get(assessment_id)
    
    if not assessment:
        return {"message": "Assessment not found"}, 404
    
    data = request.get_json()
    
    assessment.score = data.get("score", assessment.score)
    assessment.status = data.get("status", assessment.status)
    
    if assessment.total_marks > 0:
        assessment.percentage = (assessment.score / assessment.total_marks) * 100
    
    try:
        db.session.commit()
        return {"message": "Assessment updated"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Update failed: {str(e)}"}, 500


@assessments_bp.route("/student/<student_id>", methods=["GET"])
def get_student_assessments(student_id):
    """Get student's assessments"""
    student = Student.query.get(student_id)
    if not student:
        return {"message": "Student not found"}, 404
    
    assessments = Assessment.query.filter_by(student_id=student_id).all()
    
    return {
        "assessments": [
            {
                "id": str(a.id),
                "title": a.title,
                "subject": a.subject,
                "score": a.score,
                "percentage": a.percentage,
                "status": a.status,
                "taken_at": a.taken_at.isoformat()
            }
            for a in assessments
        ]
    }, 200

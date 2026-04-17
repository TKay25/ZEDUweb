from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Assessment, Course, Student
from datetime import datetime

assessments_bp = Blueprint("assessments", __name__)


@assessments_bp.route("", methods=["GET"])
@jwt_required()
def get_assessments():
    """Get all assessments"""
    assessments = Assessment.query.all()
    return {"assessments": [a.to_dict() for a in assessments]}, 200


@assessments_bp.route("/<int:assessment_id>", methods=["GET"])
@jwt_required()
def get_assessment(assessment_id):
    """Get assessment by ID"""
    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return {"message": "Assessment not found"}, 404
    return {"assessment": assessment.to_dict()}, 200


@assessments_bp.route("", methods=["POST"])
@jwt_required()
def create_assessment():
    """Create assessment"""
    data = request.get_json()
    
    try:
        assessment = Assessment(
            course_id=data.get("course_id"),
            title=data.get("title"),
            description=data.get("description"),
            assessment_type=data.get("assessment_type"),
            due_date=datetime.fromisoformat(data.get("due_date")) if data.get("due_date") else None
        )
        db.session.add(assessment)
        db.session.commit()
        return {"message": "Assessment created", "assessment": assessment.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Creation failed: {str(e)}"}, 500


@assessments_bp.route("/<int:assessment_id>", methods=["PUT"])
@jwt_required()
def update_assessment(assessment_id):
    """Update assessment"""
    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return {"message": "Assessment not found"}, 404
    
    data = request.get_json()
    assessment.title = data.get("title", assessment.title)
    assessment.description = data.get("description", assessment.description)
    assessment.assessment_type = data.get("assessment_type", assessment.assessment_type)
    
    try:
        db.session.commit()
        return {"message": "Assessment updated", "assessment": assessment.to_dict()}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Update failed: {str(e)}"}, 500


@assessments_bp.route("/<int:assessment_id>", methods=["DELETE"])
@jwt_required()
def delete_assessment(assessment_id):
    """Delete assessment"""
    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return {"message": "Assessment not found"}, 404
    
    try:
        db.session.delete(assessment)
        db.session.commit()
        return {"message": "Assessment deleted"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Delete failed: {str(e)}"}, 500

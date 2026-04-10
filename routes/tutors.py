from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Tutor, User
from datetime import datetime

tutors_bp = Blueprint("tutors", __name__)


@tutors_bp.route("", methods=["GET"])
@jwt_required()
def get_tutors():
    """Get all tutors"""
    tutors = Tutor.query.all()
    return {"tutors": [t.to_dict() for t in tutors]}, 200


@tutors_bp.route("/<int:tutor_id>", methods=["GET"])
@jwt_required()
def get_tutor(tutor_id):
    """Get tutor by ID"""
    tutor = Tutor.query.get(tutor_id)
    if not tutor:
        return {"message": "Tutor not found"}, 404
    return {"tutor": tutor.to_dict()}, 200


@tutors_bp.route("", methods=["POST"])
@jwt_required()
def create_tutor():
    """Create tutor record"""
    data = request.get_json()
    
    try:
        tutor = Tutor(
            user_id=data.get("user_id"),
            qualifications=data.get("qualifications"),
            subjects=data.get("subjects"),
            hourly_rate=data.get("hourly_rate")
        )
        db.session.add(tutor)
        db.session.commit()
        return {"message": "Tutor created", "tutor": tutor.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Creation failed: {str(e)}"}, 500


@tutors_bp.route("/<int:tutor_id>", methods=["PUT"])
@jwt_required()
def update_tutor(tutor_id):
    """Update tutor"""
    tutor = Tutor.query.get(tutor_id)
    if not tutor:
        return {"message": "Tutor not found"}, 404
    
    data = request.get_json()
    tutor.qualifications = data.get("qualifications", tutor.qualifications)
    tutor.subjects = data.get("subjects", tutor.subjects)
    tutor.hourly_rate = data.get("hourly_rate", tutor.hourly_rate)
    
    try:
        db.session.commit()
        return {"message": "Tutor updated", "tutor": tutor.to_dict()}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Update failed: {str(e)}"}, 500


@tutors_bp.route("/<int:tutor_id>", methods=["DELETE"])
@jwt_required()
def delete_tutor(tutor_id):
    """Delete tutor"""
    tutor = Tutor.query.get(tutor_id)
    if not tutor:
        return {"message": "Tutor not found"}, 404
    
    try:
        db.session.delete(tutor)
        db.session.commit()
        return {"message": "Tutor deleted"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Delete failed: {str(e)}"}, 500

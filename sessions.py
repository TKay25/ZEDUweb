from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, TutorSession, Student, Tutor
from datetime import datetime

sessions_bp = Blueprint("sessions", __name__)


@sessions_bp.route("", methods=["GET"])
@jwt_required()
def get_sessions():
    """Get all sessions"""
    sessions = TutorSession.query.all()
    return {"sessions": [s.to_dict() for s in sessions]}, 200


@sessions_bp.route("/<int:session_id>", methods=["GET"])
@jwt_required()
def get_session(session_id):
    """Get session by ID"""
    session = TutorSession.query.get(session_id)
    if not session:
        return {"message": "Session not found"}, 404
    return {"session": session.to_dict()}, 200


@sessions_bp.route("", methods=["POST"])
@jwt_required()
def create_session():
    """Create session"""
    data = request.get_json()
    
    try:
        session = TutorSession(
            student_id=data.get("student_id"),
            tutor_id=data.get("tutor_id"),
            start_time=datetime.fromisoformat(data.get("start_time")),
            end_time=datetime.fromisoformat(data.get("end_time")),
            status="scheduled"
        )
        db.session.add(session)
        db.session.commit()
        return {"message": "Session created", "session": session.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Creation failed: {str(e)}"}, 500


@sessions_bp.route("/<int:session_id>", methods=["PUT"])
@jwt_required()
def update_session(session_id):
    """Update session"""
    session = TutorSession.query.get(session_id)
    if not session:
        return {"message": "Session not found"}, 404
    
    data = request.get_json()
    session.status = data.get("status", session.status)
    session.notes = data.get("notes", session.notes)
    
    try:
        db.session.commit()
        return {"message": "Session updated", "session": session.to_dict()}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Update failed: {str(e)}"}, 500


@sessions_bp.route("/<int:session_id>", methods=["DELETE"])
@jwt_required()
def delete_session(session_id):
    """Delete session"""
    session = TutorSession.query.get(session_id)
    if not session:
        return {"message": "Session not found"}, 404
    
    try:
        db.session.delete(session)
        db.session.commit()
        return {"message": "Session deleted"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Delete failed: {str(e)}"}, 500

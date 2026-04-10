from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, TutorSession, Student, Tutor, User
from datetime import datetime

sessions_bp = Blueprint("sessions", __name__)


@sessions_bp.route("", methods=["POST"])
@jwt_required()
def create_session():
    """Schedule a tutor session"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    student_id = data.get("student_id")
    tutor_id = data.get("tutor_id")
    scheduled_at = data.get("scheduled_at")
    
    student = Student.query.get(student_id)
    tutor = Tutor.query.get(tutor_id)
    
    if not student or not tutor:
        return {"message": "Invalid student or tutor"}, 400
    
    # Check if current user is authorized
    if str(student.user_id) != current_user_id and str(tutor.user_id) != current_user_id:
        return {"message": "Unauthorized"}, 403
    
    session = TutorSession(
        tutor_id=tutor_id,
        student_id=student_id,
        scheduled_at=datetime.fromisoformat(scheduled_at),
        duration_minutes=data.get("duration_minutes", 60),
        topic=data.get("topic")
    )
    
    try:
        db.session.add(session)
        db.session.commit()
        return {"message": "Session scheduled", "session_id": str(session.id)}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Failed: {str(e)}"}, 500


@sessions_bp.route("/<session_id>", methods=["GET"])
def get_session(session_id):
    """Get session details"""
    session = TutorSession.query.get(session_id)
    
    if not session:
        return {"message": "Session not found"}, 404
    
    return {
        "session": {
            "id": str(session.id),
            "student": {
                "id": str(session.student.id),
                "name": f"{session.student.user.first_name} {session.student.user.last_name}"
            },
            "tutor": {
                "id": str(session.tutor.id),
                "name": f"{session.tutor.user.first_name} {session.tutor.user.last_name}"
            },
            "scheduled_at": session.scheduled_at.isoformat(),
            "duration_minutes": session.duration_minutes,
            "status": session.status,
            "topic": session.topic,
            "notes": session.notes
        }
    }, 200


@sessions_bp.route("/<session_id>", methods=["PUT"])
@jwt_required()
def update_session(session_id):
    """Update session (status, notes)"""
    current_user_id = get_jwt_identity()
    session = TutorSession.query.get(session_id)
    
    if not session:
        return {"message": "Session not found"}, 404
    
    # Authorization check
    if str(session.tutor.user_id) != current_user_id and str(session.student.user_id) != current_user_id:
        return {"message": "Unauthorized"}, 403
    
    data = request.get_json()
    
    session.status = data.get("status", session.status)
    session.notes = data.get("notes", session.notes)
    
    try:
        db.session.commit()
        return {"message": "Session updated"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Update failed: {str(e)}"}, 500


@sessions_bp.route("/student/<student_id>", methods=["GET"])
def get_student_sessions(student_id):
    """Get student's sessions"""
    student = Student.query.get(student_id)
    if not student:
        return {"message": "Student not found"}, 404
    
    sessions = TutorSession.query.filter_by(student_id=student_id).all()
    
    return {
        "sessions": [
            {
                "id": str(s.id),
                "tutor_name": f"{s.tutor.user.first_name} {s.tutor.user.last_name}",
                "scheduled_at": s.scheduled_at.isoformat(),
                "status": s.status,
                "topic": s.topic
            }
            for s in sessions
        ]
    }, 200


@sessions_bp.route("/tutor/<tutor_id>", methods=["GET"])
def get_tutor_sessions(tutor_id):
    """Get tutor's sessions"""
    tutor = Tutor.query.get(tutor_id)
    if not tutor:
        return {"message": "Tutor not found"}, 404
    
    sessions = TutorSession.query.filter_by(tutor_id=tutor_id).all()
    
    return {
        "sessions": [
            {
                "id": str(s.id),
                "student_name": f"{s.student.user.first_name} {s.student.user.last_name}",
                "scheduled_at": s.scheduled_at.isoformat(),
                "status": s.status,
                "topic": s.topic
            }
            for s in sessions
        ]
    }, 200

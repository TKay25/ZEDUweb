from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, Tutor, User

tutors_bp = Blueprint("tutors", __name__)


@tutors_bp.route("", methods=["GET"])
def list_tutors():
    """List all available tutors"""
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    specialization = request.args.get("specialization")
    
    query = Tutor.query.filter_by(is_available=True)
    
    if specialization:
        query = query.filter(Tutor.specializations.contains(specialization))
    
    tutors = query.paginate(page=page, per_page=per_page)
    
    result = []
    for tutor in tutors.items:
        result.append({
            "id": str(tutor.id),
            "user": tutor.user.to_dict(),
            "specializations": tutor.specializations,
            "experience_years": tutor.experience_years,
            "hourly_rate": tutor.hourly_rate,
            "rating": tutor.rating,
            "total_sessions": tutor.total_sessions
        })
    
    return {
        "tutors": result,
        "total": tutors.total,
        "pages": tutors.pages,
        "current_page": page
    }, 200


@tutors_bp.route("/<tutor_id>", methods=["GET"])
def get_tutor(tutor_id):
    """Get tutor profile"""
    tutor = Tutor.query.get(tutor_id)
    
    if not tutor:
        return {"message": "Tutor not found"}, 404
    
    return {
        "tutor": {
            "id": str(tutor.id),
            "user": tutor.user.to_dict(),
            "specializations": tutor.specializations,
            "experience_years": tutor.experience_years,
            "hourly_rate": tutor.hourly_rate,
            "rating": tutor.rating,
            "total_sessions": tutor.total_sessions,
            "is_available": tutor.is_available
        }
    }, 200


@tutors_bp.route("", methods=["POST"])
@jwt_required()
def create_tutor_profile():
    """Create tutor profile"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return {"message": "User not found"}, 404
    
    # Check if tutor profile already exists
    if Tutor.query.filter_by(user_id=current_user_id).first():
        return {"message": "Tutor profile already exists"}, 409
    
    data = request.get_json()
    
    tutor = Tutor(
        user_id=current_user_id,
        specializations=data.get("specializations", []),
        experience_years=data.get("experience_years", 0),
        hourly_rate=data.get("hourly_rate", 0),
        is_available=data.get("is_available", True)
    )
    
    try:
        db.session.add(tutor)
        db.session.commit()
        return {"message": "Tutor profile created", "tutor_id": str(tutor.id)}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Creation failed: {str(e)}"}, 500


@tutors_bp.route("/<tutor_id>", methods=["PUT"])
@jwt_required()
def update_tutor(tutor_id):
    """Update tutor profile"""
    current_user_id = get_jwt_identity()
    tutor = Tutor.query.get(tutor_id)
    
    if not tutor:
        return {"message": "Tutor not found"}, 404
    
    if str(tutor.user_id) != current_user_id:
        return {"message": "Unauthorized"}, 403
    
    data = request.get_json()
    
    tutor.specializations = data.get("specializations", tutor.specializations)
    tutor.experience_years = data.get("experience_years", tutor.experience_years)
    tutor.hourly_rate = data.get("hourly_rate", tutor.hourly_rate)
    tutor.is_available = data.get("is_available", tutor.is_available)
    
    try:
        db.session.commit()
        return {"message": "Tutor profile updated"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Update failed: {str(e)}"}, 500


@tutors_bp.route("/<tutor_id>/courses", methods=["GET"])
def get_tutor_courses(tutor_id):
    """Get tutor's courses"""
    from ..models import Course
    
    tutor = Tutor.query.get(tutor_id)
    if not tutor:
        return {"message": "Tutor not found"}, 404
    
    courses = Course.query.filter_by(tutor_id=tutor_id).all()
    
    return {
        "courses": [
            {
                "id": str(course.id),
                "title": course.title,
                "subject": course.subject,
                "level": course.level,
                "price": course.price
            }
            for course in courses
        ]
    }, 200

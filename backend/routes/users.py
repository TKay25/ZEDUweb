from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, User

users_bp = Blueprint("users", __name__)


@users_bp.route("/<user_id>", methods=["GET"])
def get_user(user_id):
    """Get user by ID"""
    user = User.query.get(user_id)
    
    if not user:
        return {"message": "User not found"}, 404
    
    return {"user": user.to_dict()}, 200


@users_bp.route("/<user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    """Update user profile"""
    current_user_id = get_jwt_identity()
    
    if current_user_id != user_id:
        return {"message": "Unauthorized"}, 403
    
    user = User.query.get(user_id)
    if not user:
        return {"message": "User not found"}, 404
    
    data = request.get_json()
    
    user.first_name = data.get("first_name", user.first_name)
    user.last_name = data.get("last_name", user.last_name)
    user.phone = data.get("phone", user.phone)
    user.avatar_url = data.get("avatar_url", user.avatar_url)
    user.bio = data.get("bio", user.bio)
    
    try:
        db.session.commit()
        return {"message": "User updated successfully", "user": user.to_dict()}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Update failed: {str(e)}"}, 500


@users_bp.route("", methods=["GET"])
def list_users():
    """List all users (admin only)"""
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    user_type = request.args.get("user_type")
    
    query = User.query
    if user_type:
        query = query.filter_by(user_type=user_type)
    
    users = query.paginate(page=page, per_page=per_page)
    
    return {
        "users": [user.to_dict() for user in users.items],
        "total": users.total,
        "pages": users.pages,
        "current_page": page
    }, 200


@users_bp.route("/<user_id>/password", methods=["PUT"])
@jwt_required()
def change_password(user_id):
    """Change user password"""
    current_user_id = get_jwt_identity()
    
    if current_user_id != user_id:
        return {"message": "Unauthorized"}, 403
    
    user = User.query.get(user_id)
    if not user:
        return {"message": "User not found"}, 404
    
    data = request.get_json()
    old_password = data.get("old_password")
    new_password = data.get("new_password")
    
    if not old_password or not new_password:
        return {"message": "Old and new passwords are required"}, 400
    
    if not user.check_password(old_password):
        return {"message": "Old password is incorrect"}, 401
    
    user.set_password(new_password)
    
    try:
        db.session.commit()
        return {"message": "Password changed successfully"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Password change failed: {str(e)}"}, 500

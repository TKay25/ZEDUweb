from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User
from datetime import datetime

users_bp = Blueprint("users", __name__)


@users_bp.route("", methods=["GET"])
@jwt_required()
def get_all_users():
    """Get all users (admin only)"""
    users = User.query.all()
    return {"users": [u.to_dict() for u in users]}, 200


@users_bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    """Get user by ID"""
    user = User.query.get(user_id)
    if not user:
        return {"message": "User not found"}, 404
    return {"user": user.to_dict()}, 200


@users_bp.route("/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    """Update user profile"""
    user = User.query.get(user_id)
    if not user:
        return {"message": "User not found"}, 404
    
    data = request.get_json()
    user.first_name = data.get("first_name", user.first_name)
    user.last_name = data.get("last_name", user.last_name)
    user.phone = data.get("phone", user.phone)
    user.updated_at = datetime.utcnow()
    
    try:
        db.session.commit()
        return {"message": "User updated", "user": user.to_dict()}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Update failed: {str(e)}"}, 500


@users_bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    """Delete user"""
    user = User.query.get(user_id)
    if not user:
        return {"message": "User not found"}, 404
    
    try:
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Delete failed: {str(e)}"}, 500


@users_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    """Update current user's profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return {"message": "User not found"}, 404
        
        data = request.get_json()
        
        if "first_name" in data:
            user.first_name = data["first_name"].strip()
        if "last_name" in data:
            user.last_name = data["last_name"].strip()
        if "phone" in data:
            user.phone = data["phone"].strip() if data["phone"] else None
        if "whatsapp_number" in data:
            user.whatsapp_number = data["whatsapp_number"].strip() if data["whatsapp_number"] else None
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return {
            "message": "Profile updated successfully",
            "user": user.to_dict()
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {"message": f"Profile update failed: {str(e)}"}, 500


@users_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    """Change user's password"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return {"message": "User not found"}, 404
        
        data = request.get_json()
        current_password = data.get("current_password", "").strip()
        new_password = data.get("new_password", "").strip()
        
        if not current_password or not new_password:
            return {"message": "Current password and new password are required"}, 400
        
        # Verify current password
        if not user.check_password(current_password):
            return {"message": "Current password is incorrect"}, 401
        
        # Validate new password
        if len(new_password) < 8:
            return {"message": "New password must be at least 8 characters long"}, 400
        
        # Set new password
        user.set_password(new_password)
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return {
            "message": "Password changed successfully"
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {"message": f"Password change failed: {str(e)}"}, 500

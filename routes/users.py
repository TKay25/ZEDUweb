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

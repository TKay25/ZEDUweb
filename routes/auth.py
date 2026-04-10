from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, User
from datetime import datetime

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    data = request.get_json()
    
    if not data or not data.get("email") or not data.get("password"):
        return {"message": "Email and password are required"}, 400
    
    if User.query.filter_by(email=data["email"]).first():
        return {"message": "Email already exists"}, 409
    
    user = User(
        email=data["email"],
        first_name=data.get("first_name", ""),
        last_name=data.get("last_name", ""),
        phone=data.get("phone"),
        user_type=data.get("user_type", "student")
    )
    user.set_password(data["password"])
    
    try:
        db.session.add(user)
        db.session.commit()
        return {"message": "User registered successfully", "user": user.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Registration failed: {str(e)}"}, 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login user"""
    data = request.get_json()
    
    if not data or not data.get("email") or not data.get("password"):
        return {"message": "Email and password are required"}, 400
    
    user = User.query.filter_by(email=data["email"]).first()
    
    if not user or not user.check_password(data["password"]):
        return {"message": "Invalid email or password"}, 401
    
    if not user.is_active:
        return {"message": "User account is inactive"}, 403
    
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    
    return {
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict()
    }, 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return {"access_token": access_token}, 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Logout user"""
    return {"message": "Logout successful"}, 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """Get current user info"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return {"message": "User not found"}, 404
    
    return {"user": user.to_dict()}, 200

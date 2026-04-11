from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, User
from datetime import datetime

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        if not data:
            return {"message": "Request body is required"}, 400
        
        # Validate required fields
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        first_name = data.get("first_name", "").strip()
        last_name = data.get("last_name", "").strip()
        user_type = data.get("user_type", "student").strip()
        whatsapp_number = data.get("whatsapp_number", "").strip()
        
        if not email or not password:
            return {"message": "Email and password are required"}, 400
        
        if not first_name or not last_name:
            return {"message": "First name and last name are required"}, 400
        
        if len(password) < 8:
            return {"message": "Password must be at least 8 characters long"}, 400
        
        if user_type not in ["student", "tutor", "parent"]:
            return {"message": "Invalid user type"}, 400
        
        # Check if email exists
        if User.query.filter_by(email=email).first():
            return {"message": "Email already exists"}, 409
        
        # Create new user
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone=data.get("phone"),
            whatsapp_number=whatsapp_number,
            user_type=user_type
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return {
            "message": "User registered successfully",
            "user": user.to_dict(),
            "redirect_dashboard": f"/{user_type}/dashboard" if user_type in ["student", "tutor", "parent"] else "/dashboard"
        }, 201
    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return {"message": f"Registration failed: {str(e)}"}, 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login user"""
    try:
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
        
        # Determine dashboard based on user type
        user_type = user.user_type.lower() if user.user_type else "student"
        dashboard_url = f"/{user_type}/dashboard" if user_type in ["student", "tutor", "parent"] else "/dashboard"
        
        return {
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_dict(),
            "redirect_dashboard": dashboard_url
        }, 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"message": f"Login failed: {str(e)}"}, 500


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

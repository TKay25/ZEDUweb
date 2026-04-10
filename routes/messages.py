from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Message, User
from datetime import datetime

messages_bp = Blueprint("messages", __name__)


@messages_bp.route("", methods=["GET"])
@jwt_required()
def get_messages():
    """Get all messages"""
    messages = Message.query.all()
    return {"messages": [m.to_dict() for m in messages]}, 200


@messages_bp.route("/<int:message_id>", methods=["GET"])
@jwt_required()
def get_message(message_id):
    """Get message by ID"""
    message = Message.query.get(message_id)
    if not message:
        return {"message": "Message not found"}, 404
    return {"message": message.to_dict()}, 200


@messages_bp.route("", methods=["POST"])
@jwt_required()
def create_message():
    """Create message"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        message = Message(
            sender_id=current_user_id,
            recipient_id=data.get("recipient_id"),
            subject=data.get("subject"),
            body=data.get("body"),
            created_at=datetime.utcnow()
        )
        db.session.add(message)
        db.session.commit()
        return {"message": "Message sent", "data": message.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Failed to send message: {str(e)}"}, 500


@messages_bp.route("/<int:message_id>", methods=["DELETE"])
@jwt_required()
def delete_message(message_id):
    """Delete message"""
    message = Message.query.get(message_id)
    if not message:
        return {"message": "Message not found"}, 404
    
    try:
        db.session.delete(message)
        db.session.commit()
        return {"message": "Message deleted"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Delete failed: {str(e)}"}, 500

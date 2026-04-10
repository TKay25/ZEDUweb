from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Message, User
from datetime import datetime

messages_bp = Blueprint("messages", __name__)


@messages_bp.route("", methods=["POST"])
@jwt_required()
def send_message():
    """Send a message"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    recipient_id = data.get("recipient_id")
    content = data.get("content")
    
    if not content:
        return {"message": "Message content is required"}, 400
    
    recipient = User.query.get(recipient_id)
    if not recipient:
        return {"message": "Recipient not found"}, 404
    
    message = Message(
        sender_id=current_user_id,
        recipient_id=recipient_id,
        content=content
    )
    
    try:
        db.session.add(message)
        db.session.commit()
        return {"message": "Message sent", "message_id": str(message.id)}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Failed: {str(e)}"}, 500


@messages_bp.route("/inbox", methods=["GET"])
@jwt_required()
def get_inbox():
    """Get inbox messages"""
    current_user_id = get_jwt_identity()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    
    messages = Message.query.filter_by(recipient_id=current_user_id).order_by(
        Message.created_at.desc()
    ).paginate(page=page, per_page=per_page)
    
    return {
        "messages": [
            {
                "id": str(m.id),
                "sender": {
                    "id": str(m.sender.id),
                    "name": f"{m.sender.first_name} {m.sender.last_name}",
                    "avatar": m.sender.avatar_url
                },
                "content": m.content,
                "is_read": m.is_read,
                "created_at": m.created_at.isoformat()
            }
            for m in messages.items
        ],
        "total": messages.total,
        "pages": messages.pages,
        "current_page": page
    }, 200


@messages_bp.route("/sent", methods=["GET"])
@jwt_required()
def get_sent():
    """Get sent messages"""
    current_user_id = get_jwt_identity()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    
    messages = Message.query.filter_by(sender_id=current_user_id).order_by(
        Message.created_at.desc()
    ).paginate(page=page, per_page=per_page)
    
    return {
        "messages": [
            {
                "id": str(m.id),
                "recipient": {
                    "id": str(m.recipient.id),
                    "name": f"{m.recipient.first_name} {m.recipient.last_name}",
                    "avatar": m.recipient.avatar_url
                },
                "content": m.content,
                "created_at": m.created_at.isoformat()
            }
            for m in messages.items
        ],
        "total": messages.total,
        "pages": messages.pages,
        "current_page": page
    }, 200


@messages_bp.route("/conversation/<user_id>", methods=["GET"])
@jwt_required()
def get_conversation(user_id):
    """Get conversation with a user"""
    current_user_id = get_jwt_identity()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 50, type=int)
    
    messages = Message.query.filter(
        ((Message.sender_id == current_user_id) & (Message.recipient_id == user_id)) |
        ((Message.sender_id == user_id) & (Message.recipient_id == current_user_id))
    ).order_by(Message.created_at.asc()).paginate(page=page, per_page=per_page)
    
    return {
        "messages": [
            {
                "id": str(m.id),
                "sender_id": str(m.sender_id),
                "recipient_id": str(m.recipient_id),
                "content": m.content,
                "is_read": m.is_read,
                "created_at": m.created_at.isoformat()
            }
            for m in messages.items
        ],
        "total": messages.total,
        "pages": messages.pages
    }, 200


@messages_bp.route("/<message_id>/read", methods=["PUT"])
@jwt_required()
def mark_as_read(message_id):
    """Mark message as read"""
    current_user_id = get_jwt_identity()
    message = Message.query.get(message_id)
    
    if not message:
        return {"message": "Message not found"}, 404
    
    if str(message.recipient_id) != current_user_id:
        return {"message": "Unauthorized"}, 403
    
    message.is_read = True
    
    try:
        db.session.commit()
        return {"message": "Message marked as read"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Failed: {str(e)}"}, 500
